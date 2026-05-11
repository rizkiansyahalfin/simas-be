// 2. Enum untuk Transaction Type (Sesuai dengan schema.prisma)
export var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "income";
    TransactionType["EXPENSE"] = "expense";
})(TransactionType || (TransactionType = {}));
export var ZisCategory;
(function (ZisCategory) {
    ZisCategory["ZAKAT"] = "zakat";
    ZisCategory["INFAQ"] = "infaq";
    ZisCategory["SHADAQAH"] = "shadaqah";
})(ZisCategory || (ZisCategory = {}));
