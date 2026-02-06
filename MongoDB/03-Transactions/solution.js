// Code Walkthrough - User Document
/*
{
    "_id": ObjectId("665f4d7e8b3e6c1e24a7b3e1"),
    "name": "Alice",
    "balance": 500.00
}
*/

// Code Walkthrough - Transaction Document
/*
{
    "_id": ObjectId("..."),
    "from": ObjectId("665f4d7e8b3e6c1e24a7b3e1"),
    "to": ObjectId("665f4d7e8b3e6c1e24a7b3e2"),
    "amount": 100.00,
    "date": ISODate("2025-05-30T10:00:00Z"),
    "status": "completed"
}
*/

// Code Walkthrough - Atomic Money Transfer with Transaction
const session = db.getMongo().startSession();
session.startTransaction();

try {
    // 1. Deduct from Alice
    db.users.updateOne(
        { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e1") },
        { $inc: { balance: -100 } },
        { session }
    );

    // 2. Add to Bob
    db.users.updateOne(
        { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e2") },
        { $inc: { balance: 100 } },
        { session }
    );

    // 3. Log the transaction
    db.transactions.insertOne(
        {
            from: ObjectId("665f4d7e8b3e6c1e24a7b3e1"),
            to: ObjectId("665f4d7e8b3e6c1e24a7b3e2"),
            amount: 100,
            date: new Date(),
            status: "completed"
        },
        { session }
    );

    // 4. Commit
    session.commitTransaction();
} catch (e) {
    session.abortTransaction();
    throw e;
} finally {
    session.endSession();
}

// Challenge: Transfer with balance check
const transferWithCheck = async (fromId, toId, amount) => {
    const session = db.getMongo().startSession();
    session.startTransaction();

    try {
        const sender = await db.users.findOne({ _id: fromId }, { session });

        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        db.users.updateOne(
            { _id: fromId },
            { $inc: { balance: -amount } },
            { session }
        );

        db.users.updateOne(
            { _id: toId },
            { $inc: { balance: amount } },
            { session }
        );

        db.transactions.insertOne(
            { from: fromId, to: toId, amount, date: new Date(), status: "completed" },
            { session }
        );

        session.commitTransaction();
    } catch (e) {
        session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }
};
