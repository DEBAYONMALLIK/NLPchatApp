const natural = require('natural');
const axios=require("axios");

async function recommendDoctors(input_string) {
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

const departmentTags = {
  generalMedicine: "fever cold cough body pain weakness headache fatigue viral infection general checkup stomach ache",

  cardiology: "heart pain chest discomfort palpitations shortness of breath high blood pressure cardiac arrest dizziness irregular heartbeat",

  dermatology: "skin rash acne pimples itching hair fall dandruff eczema allergy fungal infection skin spots pigmentation",

  pediatrics: "child fever vaccination cold cough in children growth problems nutrition issues ear pain in children stomach ache child infant care",

  gynecology: "pregnancy menstrual issues irregular periods infertility PCOS vaginal infection menopause delivery care women’s health",

  orthopedics: "joint pain knee pain back pain fracture sprain arthritis bone pain shoulder pain stiffness movement problem"
};



  try {
    // ✅ Call your backend HMS API
    const response = await axios.get("http://localhost:8080/hms/doct/api/v1/get"); 
    doctors = response.data.allDoctor || [];
    console.log("all doctors->>>",doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    return [];
  }

    doctors = doctors.filter(doctor => doctor.isActive);
    doctors.forEach(doctor => tfidf.addDocument(doctor.tags));
    
    const userProblem = input_string.toLowerCase();
    
    let indexArray = [];
    let match_freq = 0;
    
    tfidf.tfidfs(userProblem, (i, measure) => {
        if (measure === 0) return;
        
        if (measure > match_freq) {
            indexArray = [i];
            match_freq = measure;
        }
        else if (measure === match_freq) {
            indexArray.push(i);
        }
    });
    
    let doct_array = [];
    let max_review = 0;
    let max_experience = 0;

    indexArray.forEach(idx => {
        const doctor = doctors[idx];
        const score_review = doctor.review;
        const score_experience = doctor.experience;

        if (score_review > max_review) {
            doct_array = [doctor];
            max_review = score_review;
            max_experience = score_experience;
        }
        else if (score_review === max_review) {
            if (score_experience > max_experience) {
                doct_array = [doctor];
                max_experience = score_experience;
            }
            else if (score_experience === max_experience) {
                doct_array.push(doctor);
            }
        }
    });
    
    return doct_array;
}

module.exports={
    recommendDoctors,
}