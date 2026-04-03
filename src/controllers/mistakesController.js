import Mistake from "../models/Mistakes.js";


export const createMistake = async(req,res)=>{
    try{
        const {title,description,solution,category,tags,resourcesUsed, difficulty} = req.body;
        if(!title || !description){
            return res.status(400).json({
                message : "Title and description are required."
            });
        }
        const mistake = await Mistake.create({
            userId : req.user._id,
            title,
            description,
            solution,
            category,
            tags,
            resourcesUsed,
            difficulty
        });
        return res.status(201).json({
            success : true,
            message : "Mistake created successfully."
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message : error.message
        });
    }
};


export const getAllMistakes = async(req,res)=>{
    try{
        const userId = req.user._id;
        const {search , difficulty, solved,created, page, limit} = req.query;
        const query = {userId};
        if(search){
            const regex = new RegExp(search,"i");
            query.$or = [
                {title : regex},
                {description : regex},
                {solution : regex},
                {category : regex},
                {tags : regex},
            ];   
        }
        if(difficulty && ["easy","medium","hard"].includes(difficulty.toLowerCase())){
            query.difficulty = difficulty.toLowerCase();
        }
        if(solved==="true") query.solved = true;
        if(solved==="false") query.solved = false;
        if(created){
            const now = new Date();
            let startDate;
            switch(created){
                case "1month":
                    startDate = new Date(now.setMonth(now.getMonth()-1));
                    break;
                case "6months":
                    startDate = new Date(now.setMonth(now.getMonth()-6));
                    break;
                case "1year":
                    startDate = new Date(now.setFullYear(now.getFullYear()-1));
                    break;
            }
            if(startDate) query.createdAt = {$gte : startDate};
        }
        const pageNum = parseInt(page)||1;
        let perPage = parseInt(limit)||6;
        if(perPage>20) perPage = 20;
        const skip = (pageNum-1)*perPage;

        const mistakes = await Mistake.find(query)
        .sort({createdAt : -1})
        .skip(skip)
        .limit(perPage);

        const total = await Mistake.countDocuments(query);
        return res.status(200).json({
            success : true,
            count : mistakes.length,
            total,
            page : pageNum,
            totalPages : Math.ceil(total/perPage),
            data : mistakes,
        });
    }catch(error){
        console.error(error);
       return res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getMistake = async(req,res)=>{
    try{
        const mistake = await Mistake.findOne({
            _id : req.params.id,
            userId : req.user._id
        });
        if(!mistake){
            return res.status(404).json({
                success : false,
                message : "Mistake not found."
            });
        }
        return res.status(200).json({
            success : true,
            data : mistake
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Server Error"
        });
    }
};


export const updateMistake = async(req,res)=>{
    try{
        const updates = req.body;
        const mistake = await Mistake.findOneAndUpdate(
            {
            _id : req.params.id,
            userId : req.user._id
            },
            updates,
            {new : true}
        );
        if(!mistake){
            return res.status(404).json({
                success : false,
                message : "Mistake not found"
            });
        }
        return res.status(200).json({
            success : true,
            message : "Mistake updated success.",
            data : mistake
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Server Error"
        });
    }
};

export const deleteMistake = async(req,res)=>{
    try{
        const mistake = await Mistake.findOneAndDelete({
            _id : req.params.id , 
            userId : req.user._id
        });
        if(!mistake){
            return res.status(404).json({
                success : false,
                message : "Mistake not found."
            });
        }
        return res.status(200).json({
            success : true,
            message : "Mistake deleted successfully!"
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : error.message
        });
    }
};














