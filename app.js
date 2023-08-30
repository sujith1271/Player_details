const express=require("express")
const path=require("path")
const {open}=require("sqlite")
const sqlite=require("squlite3")
const app=express()
app.use(express.json())
const dbpath=path.join(__dirname,"cricketTeam.db")
let db=null
const intiliaseseveranddatabase= async ()=>{
    try{
        db=await open({
            filename:dbpath,
            driver:sqlite3.Database
        })
        app.listen(3000, () => {
        console.log("Server Running at http://localhost:3000/");
    });
    }
    catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
}
intiliaseseveranddatabase()
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
app.get("/players/", async (request,response)=>{
   const players_list= `select * 
    from player_details`
    const playerlist=await db.all(players_list)
    response.send(playerlist.map((eachplayer)=>{
        convertDbObjectToResponseObject(eachplayer)
    }))
})
app.post("/players/",async (request,response)=>{
    const create_player=request.body
    const {player_id,player_name,jersey_number,role}=create_player
    const createplayer= `INSERT INTO player_details(player_id,player_name,jersey_number,role)
    VALUES (${player_id},`${player_name}`,${jersey_number},`${role}`)`
    const dbresponse=await db.run(createplayer)
    const bookid=dbresponse.lastID
    response.send("Player Added to Team");
})
app.get("/players/:playerId/",async (request,response)=>{
    const player_list=request.params
    const player=`select*  from player_details where playerId=${playerId}`
    const player_id=await db.get(player)
    response.send(convertDbObjectToResponseObject(player_id))
})
app.put("/players/:playerId/",async (request,response)=>{
    const playerid=request.params
    const updateplayer=request.body
    const {player_id,player_name,jersey_number,role}=updateplayer
    const update_player=`UPDATE player_details SET player_id=${player_id},player_name=`${player_name}`,jersey_number=${jersey_number},role=`${role}` Where player_id=${playerid}`
    await db.run(update_player)
    response.send("Player Details Updated")
})
app.delete("/players/:playerId/",async(request,response)=>{
    const playerid=request.params
    const deleteplayer=`select * from player_details where playerId=${playerid}`
    await.db.run(deleteplayer)
    response.send("Player Removed")
})
module.exports=app