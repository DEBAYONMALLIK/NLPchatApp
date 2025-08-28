const helper=require("./helper");



async function chat_bot_controller(req,res)
{
 try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    const recommendations = await helper.recommendDoctors(symptoms.toLowerCase());
    
    if (recommendations.length === 0) {
      return res.json({
        message: "No specialists found for your symptoms. Try our General Medicine department.",
        doctors: []
      });
    }

    res.json({
      message: `Found ${recommendations.length} specialist(s) for your symptoms:`,
      doctors: recommendations.slice(0, 3) // Return top 3 matches
    });

  }catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}

module.exports={
  chat_bot_controller,
}