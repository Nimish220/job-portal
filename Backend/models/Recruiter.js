import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
    // recruiterName: {
    //     type: String,
    //     required: false,
    // },
    // jobTitle: {
    //     type: String,
    //     required: false,
    // }, // removed by wafiya
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // alternateContact: { // removed by wafiya
    //     type: String,
    // },
    // linkedIn: {
    //     type: String,
    // },
    password: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    // website: {
    //     type: String,
    // },
    // companyAddress: {
    //     street: {
    //         type: String,
    //     },
    //     city: {
    //         type: String,
    //     },
    //     state: {
    //         type: String,
    //     },
    //     postalCode: {
    //         type: String,
    //     }
    // },
    // industryType: {
    //     type: String,
    // }, // removed by wafiya
    // registrationNumber: {  //removed due to new register page (By-tushar)
    //     type: String,
    // },
    // companyPanCardNumber: {
    //     type: String,
    // },
    // companyLogo: {
    //     type: String,
    // },
    companyPanCardOrGstFile: {  //GST or PAN added
        type: String, 
    },
    role: {
        type: String,
        // enum: ["Seeker", "Recruiter"],
        default: "Recruiter",
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // New optional fields from form
    yearEstablished: { type: String },
    headquarters: { type: String },
    industry: { type: String },
    cinNumber: { type: String },
    linkedin: { type: String },
    achievements: { type: String },
    culture: { type: String },
    mission: { type: String },
    contact1: { type: String },
    contact2: { type: String },
    website: { type: String },
    logo: { type: String },

}, {
    timestamps: true,
})
export const Recruiter = mongoose.model("Recruiter", recruiterSchema);