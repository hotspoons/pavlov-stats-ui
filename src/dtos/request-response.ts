export interface RequestResponse<T>{
    offset: BigInt;
    amount: BigInt;
    resultCount: BigInt;
    sort: Sort;
    ascending: boolean;
    q: string;
    results: Array<T>;
}

export enum Sort{
    KDA,
    DKA,
    ADK,
    KDR,
    LAST_PLAYED,
    NAME
}