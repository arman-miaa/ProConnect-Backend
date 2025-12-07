"use strict";
// src/app/modules/wallet/wallet.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawFromWallet = exports.creditWallet = exports.getWallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_model_1 = require("./wallet.model");
const transaction_services_1 = require("../transaction/transaction.services");
// Seller এর জন্য balance fetch করা
const getWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    return wallet || { balance: 0, totalWithdrawn: 0, totalEarned: 0 };
});
exports.getWallet = getWallet;
// Seller কে টাকা credit করা (SETTLEMENT)
const creditWallet = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield wallet_model_1.Wallet.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    if (!wallet) {
        wallet = yield wallet_model_1.Wallet.create({
            userId: userObjectId,
            balance: amount,
            totalEarned: amount,
            totalWithdrawn: 0,
        });
    }
    else {
        wallet.balance += amount;
        wallet.totalEarned += amount;
        yield wallet.save();
    } // ❌ এখানে `createWithdrawal` কল করা ভুল। Settlement ট্রানজেকশন Order service থেকে হবে। // এই ফাংশনটি শুধু Wallet-এ ক্রেডিট করবে।
    return wallet;
});
exports.creditWallet = creditWallet;
// Seller withdrawal request - 💡 সমস্ত লজিক এখানে একত্রিত করা হলো
const withdrawFromWallet = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    let wallet = yield wallet_model_1.Wallet.findOne({ userId: userObjectId });
    if (!wallet) {
        // ✅ সংশোধন: ওয়ালেট না পেলে, নতুন একটি Wallet তৈরি করে দিন
        wallet = yield wallet_model_1.Wallet.create({
            userId: userObjectId,
            balance: 0,
            totalEarned: 0,
            totalWithdrawn: 0,
        }); // যেহেতু নতুন ওয়ালেটের ব্যালেন্স ০, তাই এটি "Insufficient balance" এরর দেবে, যা ঠিক আছে।
    } // 1. ব্যালেন্স চেক (নতুন ওয়ালেট হলে ব্যালেন্স < amount হবে, তাই এখানে এরর দেবে)
    if (wallet.balance < amount)
        throw new Error("Insufficient balance"); // 2. PENDING ট্রানজেকশন রেকর্ড তৈরি
    const transaction = yield transaction_services_1.TransactionServices.createWithdrawal(userObjectId, amount); // 3. ওয়ালেট আপডেট (ব্যালেন্স কমানো)
    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    yield wallet.save();
    return { wallet, transaction };
});
exports.withdrawFromWallet = withdrawFromWallet;
