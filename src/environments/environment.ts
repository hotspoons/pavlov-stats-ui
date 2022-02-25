// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  settings:{
    appTitle: 'Pavlov VR Stats for XYZ server',
    otherLinks:[],
    requestSettings:{
      pageSizeOptions:[3,10,50,100,200],
      defaultAmount: 3,
      defaultSort: "KDA",
      defaultSortDisplayField: "kills",
      defaultAscending: false
    },
    api:{
      baseUrl: "http://localhost:8080/api",
      leaderboardEndpoint: "/leaderboard",
      scoreboardEndpoing: "/scoreboard",
      httpHeaders:{ 'Content-Type': 'application/json' }
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
