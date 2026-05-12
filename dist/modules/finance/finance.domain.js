const parseAmount = (value) => {
    if (typeof value === 'number' || typeof value === 'bigint') {
        return Number(value);
    }
    if (typeof value === 'string') {
        return Number(value) || 0;
    }
    if (value && typeof value === 'object' && 'toNumber' in value) {
        return Number(value.toNumber()) || 0;
    }
    return 0;
};
export const calculateSummary = (cashSummary, zisSummary) => {
    const items = [...cashSummary, ...zisSummary];
    const totals = items.reduce((acc, row) => {
        const amount = parseAmount(row._sum?.amount);
        if (row.type === 'income') {
            acc.totalIncome += amount;
        }
        else {
            acc.totalExpense += amount;
        }
        return acc;
    }, { totalIncome: 0, totalExpense: 0 });
    return {
        totalIncome: totals.totalIncome,
        totalExpense: totals.totalExpense,
        balance: totals.totalIncome - totals.totalExpense,
    };
};
