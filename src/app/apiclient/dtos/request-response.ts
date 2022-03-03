export interface RequestResponse<T>{
    offset: BigInt;
    amount: BigInt;
    resultCount: BigInt;
    sort: string;
    ascending: boolean;
    q: string;
    results: Array<T>;
}


/* Didn't realize how garbage enums are in TS! Maybe need help with how to better do this
 */
export class Sort{
    private static sortMap: Record<string, string> = {
        "playerName": "NAME",
        "kills": "KDA",
        "deaths": "DKA",
        "assists": "ADK",
        "kdr": "KDR",
        "games": "GAMES",
        "lastPlayed": "LAST_PLAYED"
    };
    private static values: string[] = ["KDA", "DKA", "ADK", "KDR", "LAST_PLAYED", "GAMES", "NAME"];
    
    
    public static getValue(value: string): string{
        if(this.values.includes(value.toUpperCase().trim())){
            return value.toUpperCase();
        }
        return this.values[0];
    }

    public static getSortValueForField(field: string): string{
        let value:string = Sort.sortMap[field];
        if(typeof Sort.sortMap[field] === undefined){
            return "KDA";
        }
        return value;
    }
}
