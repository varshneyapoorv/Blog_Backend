const categoryModel = require("../models/categoryModel");

const createCategoryCtrl = async(req,res)=>{
    const {title} = req.body;
    try{
        const userId = req.params.id || req.user._id;
        const category = await categoryModel.create({title,user: userId});
        res.json({
            success: true,
            message : "category created successfully",
            category
        })
    }catch(error){
        res.status(404).send({
            success:false,
            message : error.message
        })
    }
};

// all
const fetchCategoryCtrl = async(req,res)=>{
    try{
        const category = await categoryModel.find();
        res.status(200).send({
            success:true,
            message : "fetched successfully",
            category

        })
    }catch(error){
        console.log(error);
        res.status(404).send({
            success:false,
            message : error.message,
        })
    }
}

// single category
const singleCategoyCtrl = async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id);
        res.status(200).send({
            success:true,
            message : "single category fetched successfully",
            category
        })
    }catch(error){
        console.log(error);
        res.status(404).send({
            success: false,
            message : error.message
        })
        
    }
}

// update
const updateCategoryCtrl = async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id);
        if(!category){
            return res.status(404).send({
                success:false,
                message: 'Category not found '
            })
        }
        const { title} = req.body;
        // validate and update
        if(title)category.title = title;
        await category.save();
        res.status(200).send({
            success:true,
            message: "category details updated",
            category
        })
    }catch(error){
        console.log(error);
        res.status(404).send({
            success:false,
            message : error.message
        })

    }
}

// delete category
const deleteCategoryCtrl = async(req,res)=>{
    try{
        const category = await categoryModel.findById(req.params.id)
    // validation
    if(!category){
        return res.status(404).send({
            success : false,
            message : "category not found"
        })
    }
    await category.deleteOne();
    res.status(200).send({
        sucess:true,
        message : "category deleted successfully"
    })
    }catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
}

module.exports = {
    createCategoryCtrl,
    fetchCategoryCtrl,
    singleCategoyCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
}