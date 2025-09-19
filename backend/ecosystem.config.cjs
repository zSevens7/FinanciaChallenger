module.exports = {
  apps : [{
    name   : "financia-backend",
    script : "./src/server.js",
    // O `cwd` (Current Working Directory) diz ao PM2 para onde navegar antes de executar o script.
    // O valor `__dirname` é o caminho do arquivo `ecosystem.config.js`
    cwd    : __dirname,
    watch  : true,
    ignore_watch: ["node_modules"],
    env: {
      NODE_ENV: "production",
    }
  }]
};
