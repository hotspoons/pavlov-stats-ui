export const environment = {
  production: true,
  settings:{
    appTitle: 'Pavlov VR Stats for XYZ server',
    otherLinks:[],
    requestSettings:{
      pageSizeOptions:[10,50,100,200],
      defaultAmount: 50,
      defaultSort: "KDA",
      defaultAscending: false
    },
    api:{
      baseUrl: "https://fqdn-server-with-valid-ssl.com/api",
      leaderboardEndpoint: "/leaderboard",
      scoreboardEndpoing: "/scoreboard",
      httpHeaders:{ 'Content-Type': 'application/json' }
    }
  }
};
