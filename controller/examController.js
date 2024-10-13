 
     const ExamPaper = require('../model/examModel');
     const MarkingScheme = require('../model/examMarking'); // Require MarkingScheme model
     const Subject=require('../model/subjectModel'); 
     const { uploadOnCloudinary, deleteImage } = require('../utils/cloudinary');
     const mongoose =require("mongoose");
     exports.addExamPaper = async (req, res) => {
       try {
        console.log(req.body)
         const { exam, subject, year, paperType,chapters } = req.body; // No "questions" in the model
     
         const pdfFile = req.files?.pdfFile;
         const markingSchemeFile = req.files?.markingScheme;
     
         let uploadedPdf = null;
         let uploadedMarkingScheme = null;
          
         const foundSubject = await Subject.findOne({ name: subject, exam }); 
         if (!foundSubject) {
           return res.status(400).json({ error: 'Subject not found' }); 
         }
     
         if (pdfFile) {
           uploadedPdf = await uploadOnCloudinary(pdfFile[0].path, 'exam-papers');
         }
     
         // Create the ExamPaper first
         const newExamPaper = new ExamPaper({
           exam,
           subject: foundSubject._id, // Reference the Subject
        chapters,
           year,
           paperType,
           fileUrl: uploadedPdf ? uploadedPdf.url : null, // Directly store the URL 
         });
     
         await newExamPaper.save();
     
         // Now handle marking scheme upload and creation
         if (markingSchemeFile) {
           uploadedMarkingScheme = await uploadOnCloudinary(markingSchemeFile[0].path, 'marking-schemes');
           
           const newMarkingScheme = new MarkingScheme({
             examPaper: newExamPaper._id,  // Reference the created ExamPaper
             year: newExamPaper.year,      // Assuming the year is the same as the ExamPaper
             fileUrl: uploadedMarkingScheme.url, 
           });
       console.log(newMarkingScheme);
           await newMarkingScheme.save();
         }
     
         res.status(201).json({
           message: 'Exam paper added successfully',
           examPaper: newExamPaper,
         });
       } catch (error) {
         console.error('Error adding exam paper:', error);
         res.status(500).json({ error: 'Error adding exam paper' });
       }
     };
     
     // ... Other controller functions ...
     
     exports.updateExamPaper = async (req, res) => {
       try {
         const examPaperId = req.params.id;
         const updates = req.body; 
         const pdfFile = req.files?.pdfFile;
         const markingSchemeFile = req.files?.markingScheme; 
     
         // Handle PDF update 
         if (pdfFile) {
           const existingExamPaper = await ExamPaper.findById(examPaperId);
           if (existingExamPaper && existingExamPaper.fileUrl) {
             await deleteImage(existingExamPaper.fileUrl);
           }
           const uploadedPdf = await uploadOnCloudinary(pdfFile[0].path, 'exam-papers');
           updates.fileUrl = uploadedPdf.url; 
         }
     
         // Handle marking scheme update (needs to be done separately)
         if (markingSchemeFile) {
           // 1. Find the existing marking scheme (you might need to adjust the query)
           const existingMarkingScheme = await MarkingScheme.findOne({ examPaper: examPaperId }); 
     
           if (existingMarkingScheme) {
             // 2. Delete the old marking scheme from Cloudinary (if exists)
             if (existingMarkingScheme.fileUrl) {
               await deleteImage(existingMarkingScheme.fileUrl); 
             }
     
             // 3. Upload the new marking scheme 
             const uploadedMarkingScheme = await uploadOnCloudinary(markingSchemeFile[0].path, 'marking-schemes');
     
             // 4. Update the existingMarkingScheme with the new URL 
             existingMarkingScheme.fileUrl = uploadedMarkingScheme.url;
             await existingMarkingScheme.save();
           } 
         }
     
         const updatedExamPaper = await ExamPaper.findByIdAndUpdate(
           examPaperId,
           { $set: updates },
           { new: true } 
         );
     
         if (!updatedExamPaper) {
           return res.status(404).json({ message: 'Exam paper not found' });
         }
     
         res.status(200).json({
           message: 'Exam paper updated successfully',
           examPaper: updatedExamPaper,
         });
       } catch (error) {
         console.error('Error updating exam paper:', error);
         res.status(500).json({ error: 'Error updating exam paper' });
       }
     };
     
     // ... deleteExamPaper and other controller functions ...
exports.deleteExamPaper = async (req, res) => {
  try {
    const examPaperId = req.params.id;

    // Fetch exam paper to delete associated files from Cloudinary
    const examPaperToDelete = await ExamPaper.findById(examPaperId);

    if (examPaperToDelete) {
      // Delete PDF from Cloudinary (if it exists)
      if (examPaperToDelete.pdfFile && examPaperToDelete.pdfFile.public_id) {
        await deleteImage(examPaperToDelete.pdfFile.public_id); 
      }

      // Delete marking scheme from Cloudinary (if it exists)
      if (examPaperToDelete.markingScheme && examPaperToDelete.markingScheme.public_id) {
        await deleteImage(examPaperToDelete.markingScheme.public_id);
      }

      // Delete exam paper from database 
      await ExamPaper.findByIdAndDelete(examPaperId);
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: 'Exam paper not found' }); 
    }

  } catch (error) {
    console.error('Error deleting exam paper:', error); 
    res.status(500).json({ error: 'Error deleting exam paper' }); 
  }
}; 



// Controller functions (example - add more as needed):



exports.getAllExamPapers = async (req, res) => {
  try {
    const { exam, subject, level, year, paperType } = req.query; // Get filter parameters from query string

    // 1. Build the $match stage (for filtering)
    const matchStage = {};

    if (exam) {
      matchStage.exam = exam;
    }
    if (subject) {
      // Assuming you want to filter by subject name
      matchStage.subject = new mongoose.Types.ObjectId(subject); 
    }
    if (level) {
      matchStage.level = level;
    }
    if (year) {
      matchStage.year = parseInt(year); // Assuming year is a number
    }
    if (paperType) {
      matchStage.paperType = paperType;
    }

    // 2. Create the aggregation pipeline
    const examPapers = await ExamPaper.aggregate([
      { 
        $match: matchStage 
      },
      { 
        $lookup: { // Populate subject details
          from: 'subjects', // The name of your Subject collection
          localField: 'subject',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject' // Unwind the 'subject' array to get individual subject objects
      },
      // { $sort: { year: -1 }}, // Optionally sort by year (descending)
      // ... Add other aggregation stages as needed (e.g., pagination)
    ]);

    res.json(examPapers); 
  } catch (error) {
    console.error('Error fetching exam papers:', error);
    res.status(500).json({ error: 'Error fetching exam papers' });
  }
};

exports.getExamPaperById = async (req, res) => { 
  try {
    const examPaper = await ExamPaper.findById(req.params.id);
    if (!examPaper) {
      return res.status(404).json({ message: 'Exam paper not found' });
    }
    res.json(examPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
