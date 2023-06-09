const Thing = require('../models/guides');
const fs = require('fs');
const uploadImage = require('../utils/uploadImage');
const cloudinary = require('../config/cloudinary-config');
const Category = require('../models/categorie');
const Subcategory = require('../models/Subcategory');
exports.createThing = async (req, res, next) => {
    const thingObject = req.body;
    const categoryId = req.body.category;

    delete thingObject._id;
    delete thingObject._userId;

  
    let imageUrl;
  
    if (req.file) {
      imageUrl = await uploadImage(req.file);
      if (!imageUrl) {
        return res.status(400).json({ error: 'Erreur lors de l\'upload de l\'image !'});
      }
    } else {
      imageUrl = '/images/default.jpg';
    }
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);


    const category = await Category.findById(categoryId);
    const parentCategory = category.parentCategory 
  ? await Category.findById(category.parentCategory) 
  : { _id: "" };
    if (!category) { 
      return res.status(400).json({ error: 'Category invalide' });
    }
    
  
  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl,
    category: category._id,
    parentCategory: parentCategory._id 

  });
  
  await thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => res.status(400).json({ error : error.message}));
};


    

      exports.modifyThing = async (req, res, next) => {
        try {
            const thing = await Thing.findOne({ _id: req.params.id });
    
            if (!thing) {
                return res.status(404).json({ error: "L'objet n'existe pas" });
            }
    
            const thingObject = req.body;
            delete thingObject._id;
            delete thingObject._userId;
    
            let imageUrl = thing.imageUrl;
    
            if (req.file) {
                imageUrl = await uploadImage(req.file);
                if (!imageUrl) {
                    return res.status(400).json({ error: 'Erreur lors de l\'upload de l\'image !' });
                }
            }
    
            const category = await Category.findById(req.body.categoryId);
            if (req.body.categoryId && !category) {
                return res.status(400).json({ error: 'Catégorie invalide' });
            }
    
            const updatedThing = {
                ...thing.toObject(),
                ...thingObject,
                imageUrl,
                category: req.body.categoryId ? category : thing.category
            };
    
            await Thing.updateOne({ _id: req.params.id }, updatedThing)
    
            res.status(200).json({ message: 'Objet modifié !' });
        } catch (error) {
            res.status(500).json({ error });
        }
    };

    exports.deleteThing = async (req, res, next) => {
      const thing = await Thing.findOne({ _id: req.params.id });
    
      // Supprimer l'image sur Cloudinary
      await cloudinary.uploader.destroy(thing.imageUrl);
    
      // Supprimer l'objet
      await Thing.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Objet supprimé !' });
    }
    exports.getOneThing = (req, res, next) => {
      Thing.findOne({ _id: req.params.id })
      .populate({
      path: 'category',
      populate: {
      path: 'parentCategory',
      model: 'Category',
      },
      })
      .then((thing) => {
      res.status(200).json(thing);
      })
      .catch((error) => res.status(404).json({ error }));
      };

exports.getThings = (req, res, next) => {
  Thing.find()
    .populate({
      path: 'category',
      populate: {
        path: 'parentCategory',
        model: 'Category',
      },
    })
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

