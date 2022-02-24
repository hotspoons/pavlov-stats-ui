export interface RequestResponse<T>{
    offset: BigInt;
    amount: BigInt;
    resultCount: BigInt;
    sort: string;
    ascending: boolean;
    q: string;
    results: Array<T>;
}

/* Didn't realize how garbage enums are in TS!
 */
export class Sort{
    private static values: string[] = ["KDA", "DKA", "ADK", "KDR", "LAST_PLAYED", "NAME"];
    
    public static getValue(value: string): string{
        if(this.values.includes(value.toUpperCase().trim())){
            return value.toUpperCase();
        }
        return this.values[0];
    }
}
