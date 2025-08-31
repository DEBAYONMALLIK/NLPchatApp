const controller= require("./controller.js")

module.exports=(app)=>{
    app.post("/api/recommend",controller.chat_bot_controller);
}