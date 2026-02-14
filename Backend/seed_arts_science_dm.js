// // seed_arts_science_dm.js
// // Run: mongosh "<MONGO_URI>" seed_arts_science_dm.js

// (function () {
//   // ====== CONFIG ======
//   const CENTER_ID = ObjectId("698f9ac0a8727040d6d0eb47"); // Arts & Science center (already exists)
//   const COURSE_TITLE = "Arts & Science";
//   const COURSE_DESC = "";
//   const COURSE_LANGUAGE = "english";
//   const COURSE_TYPE = "online";
//   const COURSE_IMAGE = "";

//   // If you want to hardcode, set these. Otherwise it auto-generates a unique one.
//   const FIXED_COURSE_CODE = null; // e.g. "ARTS_SCIENCE_DM_001"

//   // ====== COLLECTIONS (edit if your names differ) ======
//   const Centers = db.centers;
//   const Courses = db.courses;
//   const Subjects = db.subjects;
//   const Sessions = db.sessions;
//   const Resources = db.resources;

//   // ====== HELPERS ======
//   const slugify = (s) =>
//     String(s || "")
//       .trim()
//       .toLowerCase()
//       .replace(/&/g, "and")
//       .replace(/[^a-z0-9]+/g, "_")
//       .replace(/(^_|_$)/g, "");

//   const randomCode = () => Math.random().toString(36).slice(2, 6).toUpperCase();

//   const makeUniqueCourseCode = () => {
//     const base = slugify(COURSE_TITLE).toUpperCase();
//     // try a few times to avoid rare collisions
//     for (let i = 0; i < 20; i++) {
//       const code = `${base}_DM_${randomCode()}`;
//       const exists = Courses.findOne({ courseCodeLower: code.toLowerCase() }, { _id: 1 });
//       if (!exists) return code;
//     }
//     // fallback with timestamp
//     return `${base}_DM_${Date.now()}`;
//   };

//   const sessionNumberFromTitle = (t) => {
//     const m = String(t || "").match(/(\d+)/);
//     return m ? Number(m[1]) : 1;
//   };

//   const bucketFromUrl = (url) => {
//     try {
//       const u = new URL(url);
//       const parts = u.pathname.split("/").filter(Boolean);
//       return parts[0] || null; // bucket
//     } catch {
//       return null;
//     }
//   };

//   const objectPathFromUrl = (url) => {
//     try {
//       const u = new URL(url);
//       const parts = u.pathname.split("/").filter(Boolean);
//       return parts.slice(1).join("/") || null; // path after bucket
//     } catch {
//       return null;
//     }
//   };

//   const extFromPath = (p) => {
//     if (!p) return "";
//     const i = p.lastIndexOf(".");
//     return i >= 0 ? p.slice(i + 1).toLowerCase() : "";
//   };

//   const categoryFromExt = (ext) => {
//     if (ext === "pdf") return "pdf";
//     if (ext === "ppt" || ext === "pptx") return "ppt";
//     if (["mp4", "mov", "mkv", "webm"].includes(ext)) return "video";
//     if (["doc", "docx"].includes(ext)) return "docs";
//     if (["xls", "xlsx", "csv"].includes(ext)) return "sheets";
//     return "pdf";
//   };

//   const mimeFromExt = (ext) => {
//     if (ext === "pdf") return "application/pdf";
//     if (ext === "ppt") return "application/vnd.ms-powerpoint";
//     if (ext === "pptx") return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
//     if (ext === "mp4") return "video/mp4";
//     if (ext === "webm") return "video/webm";
//     return "application/octet-stream";
//   };

//   const now = () => new Date();

//   // ====== VALIDATE CENTER EXISTS ======
//   const center = Centers.findOne({ _id: CENTER_ID }, { _id: 1, name: 1 });
//   if (!center) {
//     throw new Error(`Center not found for _id=${CENTER_ID}. Insert center first or fix CENTER_ID.`);
//   }
//   print(`✅ Center OK: ${center.name} (${center._id})`);

//   // ====== DATA TO INSERT ======
//   const DATA = [
//     {
//       subjectTitle: "The Foundation of Digital Marketing",
//       sessions: [
//         {
//           title: "Session 1",
//           resources: [
//             {
//               title: "ssession 1fdm",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_1/1770977485692-345886615-ssession_1fdm.pdf",
//               bytes: 3164689,
//               publicId:
//                 "lms/ppts/arts_science/session_1/1770977485692-345886615-ssession_1fdm.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 2",
//           resources: [
//             {
//               title: "session 2fdm",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_2/1770977511208-893794029-session_2fdm.pdf",
//               bytes: 3396253,
//               publicId:
//                 "lms/ppts/arts_science/session_2/1770977511208-893794029-session_2fdm.pdf",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       subjectTitle: "AI-Driven Digital Marketing",
//       sessions: [
//         {
//           title: "Session 1",
//           resources: [
//             {
//               title: "session 1",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_1/1770977720817-809105688-session_1.pdf",
//               bytes: 12532014,
//               publicId:
//                 "lms/ppts/arts_science/session_1/1770977720817-809105688-session_1.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 2",
//           resources: [
//             {
//               title: "session 2",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_2/1770977773276-178031448-session_2.pdf",
//               bytes: 8643547,
//               publicId:
//                 "lms/ppts/arts_science/session_2/1770977773276-178031448-session_2.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 3",
//           resources: [
//             {
//               title: "session 3",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_3/1770977827672-423277921-session_3.pdf",
//               bytes: 6343784,
//               publicId:
//                 "lms/ppts/arts_science/session_3/1770977827672-423277921-session_3.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 4",
//           resources: [
//             {
//               title: "session 4",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_4/1770977857615-70466438-session_4.pdf",
//               bytes: 1889454,
//               publicId:
//                 "lms/ppts/arts_science/session_4/1770977857615-70466438-session_4.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 5",
//           resources: [
//             {
//               title: "INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_5/1770977884796-429885157-INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION.pdf",
//               bytes: 4861936,
//               publicId:
//                 "lms/ppts/arts_science/session_5/1770977884796-429885157-INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 6",
//           resources: [
//             {
//               title: "INTERVENTION-6-AI-VIDEO-CONTENT-CREATION (2)",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_6/1770977909527-453505877-INTERVENTION-6-AI-VIDEO-CONTENT-CREATION_2.pdf",
//               bytes: 5766161,
//               publicId:
//                 "lms/ppts/arts_science/session_6/1770977909527-453505877-INTERVENTION-6-AI-VIDEO-CONTENT-CREATION_2.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 7",
//           resources: [
//             {
//               title: "session 7 Content-Automation-Workflows-and-Planning",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_7/1770977941654-17927065-session_7_Content-Automation-Workflows-and-Planning.pdf",
//               bytes: 4489723,
//               publicId:
//                 "lms/ppts/arts_science/session_7/1770977941654-17927065-session_7_Content-Automation-Workflows-and-Planning.pdf",
//             },
//           ],
//         },
//         {
//           title: "Session 9",
//           resources: [
//             {
//               title: "session 9",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_9/1770977989856-58302581-session_9.pptx",
//               bytes: 20890738,
//               publicId:
//                 "lms/ppts/arts_science/session_9/1770977989856-58302581-session_9.pptx",
//             },
//           ],
//         },
//         {
//           title: "Session 10",
//           resources: [
//             {
//               title: "session 10",
//               publicUrl:
//                 "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_10/1770978035808-440860329-session_10.pdf",
//               bytes: 11855974,
//               publicId:
//                 "lms/ppts/arts_science/session_10/1770978035808-440860329-session_10.pdf",
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   // ====== UPSERT-LIKE INSERTS (safe to re-run) ======

//   // 1) Course
//   let course = Courses.findOne({ centerId: CENTER_ID, title: COURSE_TITLE });
//   if (!course) {
//     const courseCode = FIXED_COURSE_CODE || makeUniqueCourseCode();
//     Courses.insertOne({
//       centerId: CENTER_ID,
//       title: COURSE_TITLE,
//       description: COURSE_DESC,
//       courseCode,
//       courseCodeLower: courseCode.toLowerCase(),
//       language: COURSE_LANGUAGE,
//       imageUrl: COURSE_IMAGE,
//       courseType: COURSE_TYPE,
//       isActive: true,
//       nmPublished: false,
//       nmApproved: false,
//       totalSubjects: 0,
//       objectives: [],
//       createdAt: now(),
//       updatedAt: now(),
//     });
//     course = Courses.findOne({ centerId: CENTER_ID, title: COURSE_TITLE });
//     print(`✅ Created Course: ${course.title} (${course._id}) code=${course.courseCode}`);
//   } else {
//     print(`ℹ️ Course exists: ${course.title} (${course._id})`);
//   }

//   // 2) Subjects, Sessions, Resources
//   for (const subjData of DATA) {
//     let subj = Subjects.findOne({ courseId: course._id, title: subjData.subjectTitle });
//     if (!subj) {
//       const ins = Subjects.insertOne({
//         courseId: course._id,
//         title: subjData.subjectTitle,
//         content: "",
//         isActive: true,
//         totalSessions: 0,
//         createdAt: now(),
//         updatedAt: now(),
//       });
//       subj = Subjects.findOne({ _id: ins.insertedId });
//       print(`✅ Created Subject: ${subj.title} (${subj._id})`);
//     } else {
//       print(`ℹ️ Subject exists: ${subj.title} (${subj._id})`);
//     }

//     for (const sessData of subjData.sessions) {
//       const sessionNumber = sessionNumberFromTitle(sessData.title);

//       let sess = Sessions.findOne({ subjectId: subj._id, sessionNumber });
//       if (!sess) {
//         const ins = Sessions.insertOne({
//           subjectId: subj._id,
//           title: sessData.title,
//           description: "",
//           sessionNumber,
//           isActive: true,
//           createdAt: now(),
//           updatedAt: now(),
//         });
//         sess = Sessions.findOne({ _id: ins.insertedId });
//         print(`✅ Created Session: ${sess.title} (#${sessionNumber}) (${sess._id})`);
//       } else {
//         print(`ℹ️ Session exists: ${sess.title} (#${sessionNumber}) (${sess._id})`);
//       }

//       for (const r of sessData.resources) {
//         const publicUrl = r.publicUrl;
//         const bucket = bucketFromUrl(publicUrl) || "naan_muthalvan_beez";
//         const objectPath = r.publicId || objectPathFromUrl(publicUrl);
//         const ext = extFromPath(objectPath || publicUrl);
//         const category = categoryFromExt(ext);
//         const gcsUri = objectPath ? `gs://${bucket}/${objectPath}` : null;
//         const fileName = objectPath ? objectPath.split("/").pop() : null;

//         const exists = Resources.findOne({
//           sessionId: sess._id,
//           $or: [{ publicUrl }, ...(gcsUri ? [{ gcsUri }] : [])],
//         });

//         if (exists) {
//           print(`  ↪️ Resource exists (skip): ${r.title}`);
//           continue;
//         }

//         Resources.insertOne({
//           sessionId: sess._id,
//           title: r.title,
//           description: "",
//           type: "file",
//           storageProvider: "gcs",
//           gcsBucket: bucket,
//           gcsObjectPath: objectPath,
//           gcsUri,
//           publicUrl,
//           originalFileName: fileName || r.title,
//           mimeType: mimeFromExt(ext),
//           sizeBytes: r.bytes || null,
//           fileExt: ext || null,
//           category,
//           url: publicUrl, // legacy
//           fileName,
//           isActive: true,
//           createdAt: now(),
//           updatedAt: now(),
//         });

//         print(`  ✅ Inserted Resource: ${r.title}`);
//       }
//     }
//   }

//   // 3) Counters
//   const totalSubjects = Subjects.countDocuments({ courseId: course._id });
//   Courses.updateOne(
//     { _id: course._id },
//     { $set: { totalSubjects, updatedAt: now() } }
//   );

//   const subjectList = Subjects.find({ courseId: course._id }, { _id: 1 }).toArray();
//   for (const s of subjectList) {
//     const totalSessions = Sessions.countDocuments({ subjectId: s._id });
//     Subjects.updateOne(
//       { _id: s._id },
//       { $set: { totalSessions, updatedAt: now() } }
//     );
//   }

//   print("====================================");
//   print("✅ Seed completed successfully.");
//   print(`CourseId: ${course._id}`);
//   print(`totalSubjects: ${totalSubjects}`);
//   print("====================================");
// })();




// seed_arts_science_new.js
// Run: mongosh "mongodb://localhost:27017/lms" seed_arts_science_new.js

(function () {
  // ====== CONFIG ======
  const CENTER_NAME = "Arts & Science";
  const CENTER_DESC = "Arts & Science Related Courses";
  const CENTER_IMAGE = "";

  const COURSE_TITLE = "Arts & Science";
  const COURSE_DESC = "";
  const COURSE_LANGUAGE = "english";
  const COURSE_TYPE = "online";
  const COURSE_IMAGE = "";

  // Set this if you want fixed unique code; otherwise it auto-generates
  const FIXED_COURSE_CODE = null; // e.g. "ARTS_SCIENCE_DM_001"

  // ====== COLLECTIONS (edit if your names differ) ======
  const Centers = db.centers;
  const Courses = db.courses;
  const Subjects = db.subjects;
  const Sessions = db.sessions;
  const Resources = db.resources;

  // ====== HELPERS ======
  const slugify = (s) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");

  const randomCode = () => Math.random().toString(36).slice(2, 6).toUpperCase();

  const makeUniqueCourseCode = () => {
    const base = slugify(COURSE_TITLE).toUpperCase();
    for (let i = 0; i < 20; i++) {
      const code = `${base}_DM_${randomCode()}`;
      const exists = Courses.findOne({ courseCodeLower: code.toLowerCase() }, { _id: 1 });
      if (!exists) return code;
    }
    return `${base}_DM_${Date.now()}`;
  };

  const sessionNumberFromTitle = (t) => {
    const m = String(t || "").match(/(\d+)/);
    return m ? Number(m[1]) : 1;
  };

  const bucketFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || null;
    } catch {
      return null;
    }
  };

  const objectPathFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.slice(1).join("/") || null;
    } catch {
      return null;
    }
  };

  const extFromPath = (p) => {
    if (!p) return "";
    const i = p.lastIndexOf(".");
    return i >= 0 ? p.slice(i + 1).toLowerCase() : "";
  };

  const categoryFromExt = (ext) => {
    if (ext === "pdf") return "pdf";
    if (ext === "ppt" || ext === "pptx") return "ppt";
    if (["mp4", "mov", "mkv", "webm"].includes(ext)) return "video";
    if (["doc", "docx"].includes(ext)) return "docs";
    if (["xls", "xlsx", "csv"].includes(ext)) return "sheets";
    return "pdf";
  };

  const mimeFromExt = (ext) => {
    if (ext === "pdf") return "application/pdf";
    if (ext === "ppt") return "application/vnd.ms-powerpoint";
    if (ext === "pptx")
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (ext === "mp4") return "video/mp4";
    if (ext === "webm") return "video/webm";
    return "application/octet-stream";
  };

  const now = () => new Date();

  // ====== DATA TO INSERT ======
  const DATA = [
    {
      subjectTitle: "The Foundation of Digital Marketing",
      sessions: [
        {
          title: "Session 1",
          resources: [
            {
              title: "ssession 1fdm",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_1/1770977485692-345886615-ssession_1fdm.pdf",
              bytes: 3164689,
              publicId:
                "lms/ppts/arts_science/session_1/1770977485692-345886615-ssession_1fdm.pdf",
            },
          ],
        },
        {
          title: "Session 2",
          resources: [
            {
              title: "session 2fdm",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_2/1770977511208-893794029-session_2fdm.pdf",
              bytes: 3396253,
              publicId:
                "lms/ppts/arts_science/session_2/1770977511208-893794029-session_2fdm.pdf",
            },
          ],
        },
      ],
    },
    {
      subjectTitle: "AI-Driven Digital Marketing",
      sessions: [
        {
          title: "Session 1",
          resources: [
            {
              title: "session 1",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_1/1770977720817-809105688-session_1.pdf",
              bytes: 12532014,
              publicId:
                "lms/ppts/arts_science/session_1/1770977720817-809105688-session_1.pdf",
            },
          ],
        },
        {
          title: "Session 2",
          resources: [
            {
              title: "session 2",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_2/1770977773276-178031448-session_2.pdf",
              bytes: 8643547,
              publicId:
                "lms/ppts/arts_science/session_2/1770977773276-178031448-session_2.pdf",
            },
          ],
        },
        {
          title: "Session 3",
          resources: [
            {
              title: "session 3",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_3/1770977827672-423277921-session_3.pdf",
              bytes: 6343784,
              publicId:
                "lms/ppts/arts_science/session_3/1770977827672-423277921-session_3.pdf",
            },
          ],
        },
        {
          title: "Session 4",
          resources: [
            {
              title: "session 4",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_4/1770977857615-70466438-session_4.pdf",
              bytes: 1889454,
              publicId:
                "lms/ppts/arts_science/session_4/1770977857615-70466438-session_4.pdf",
            },
          ],
        },
        {
          title: "Session 5",
          resources: [
            {
              title: "INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_5/1770977884796-429885157-INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION.pdf",
              bytes: 4861936,
              publicId:
                "lms/ppts/arts_science/session_5/1770977884796-429885157-INTERVENTION-5-AI-IMAGE-and-VISUAL-CONTENT-CREATION.pdf",
            },
          ],
        },
        {
          title: "Session 6",
          resources: [
            {
              title: "INTERVENTION-6-AI-VIDEO-CONTENT-CREATION (2)",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_6/1770977909527-453505877-INTERVENTION-6-AI-VIDEO-CONTENT-CREATION_2.pdf",
              bytes: 5766161,
              publicId:
                "lms/ppts/arts_science/session_6/1770977909527-453505877-INTERVENTION-6-AI-VIDEO-CONTENT-CREATION_2.pdf",
            },
          ],
        },
        {
          title: "Session 7",
          resources: [
            {
              title: "session 7 Content-Automation-Workflows-and-Planning",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_7/1770977941654-17927065-session_7_Content-Automation-Workflows-and-Planning.pdf",
              bytes: 4489723,
              publicId:
                "lms/ppts/arts_science/session_7/1770977941654-17927065-session_7_Content-Automation-Workflows-and-Planning.pdf",
            },
          ],
        },
        {
          title: "Session 9",
          resources: [
            {
              title: "session 9",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_9/1770977989856-58302581-session_9.pptx",
              bytes: 20890738,
              publicId:
                "lms/ppts/arts_science/session_9/1770977989856-58302581-session_9.pptx",
            },
          ],
        },
        {
          title: "Session 10",
          resources: [
            {
              title: "session 10",
              publicUrl:
                "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/arts_science/session_10/1770978035808-440860329-session_10.pdf",
              bytes: 11855974,
              publicId:
                "lms/ppts/arts_science/session_10/1770978035808-440860329-session_10.pdf",
            },
          ],
        },
      ],
    },
  ];

  // ====== 1) Create/Find Center ======
  let center = Centers.findOne({ name: CENTER_NAME });
  if (!center) {
    const ins = Centers.insertOne({
      name: CENTER_NAME,
      description: CENTER_DESC,
      imageUrl: CENTER_IMAGE,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
    });
    center = Centers.findOne({ _id: ins.insertedId });
    print(`✅ Created Center: ${center.name} (${center._id})`);
  } else {
    print(`ℹ️ Center exists: ${center.name} (${center._id})`);
  }

  // ====== 2) Create/Find Course ======
  let course = Courses.findOne({ centerId: center._id, title: COURSE_TITLE });
  if (!course) {
    const courseCode = FIXED_COURSE_CODE || makeUniqueCourseCode();
    Courses.insertOne({
      centerId: center._id,
      title: COURSE_TITLE,
      description: COURSE_DESC,
      courseCode,
      courseCodeLower: courseCode.toLowerCase(),
      language: COURSE_LANGUAGE,
      imageUrl: COURSE_IMAGE,
      courseType: COURSE_TYPE,
      isActive: true,
      nmPublished: false,
      nmApproved: false,
      totalSubjects: 0,
      objectives: [],
      createdAt: now(),
      updatedAt: now(),
    });
    course = Courses.findOne({ centerId: center._id, title: COURSE_TITLE });
    print(`✅ Created Course: ${course.title} (${course._id}) code=${course.courseCode}`);
  } else {
    print(`ℹ️ Course exists: ${course.title} (${course._id})`);
  }

  // ====== 3) Subjects, Sessions, Resources ======
  for (const subjData of DATA) {
    let subj = Subjects.findOne({ courseId: course._id, title: subjData.subjectTitle });
    if (!subj) {
      const ins = Subjects.insertOne({
        courseId: course._id,
        title: subjData.subjectTitle,
        content: "",
        isActive: true,
        totalSessions: 0,
        createdAt: now(),
        updatedAt: now(),
      });
      subj = Subjects.findOne({ _id: ins.insertedId });
      print(`✅ Created Subject: ${subj.title} (${subj._id})`);
    } else {
      print(`ℹ️ Subject exists: ${subj.title} (${subj._id})`);
    }

    for (const sessData of subjData.sessions) {
      const sessionNumber = sessionNumberFromTitle(sessData.title);

      let sess = Sessions.findOne({ subjectId: subj._id, sessionNumber });
      if (!sess) {
        const ins = Sessions.insertOne({
          subjectId: subj._id,
          title: sessData.title,
          description: "",
          sessionNumber,
          isActive: true,
          createdAt: now(),
          updatedAt: now(),
        });
        sess = Sessions.findOne({ _id: ins.insertedId });
        print(`✅ Created Session: ${sess.title} (#${sessionNumber}) (${sess._id})`);
      } else {
        print(`ℹ️ Session exists: ${sess.title} (#${sessionNumber}) (${sess._id})`);
      }

      for (const r of sessData.resources) {
        const publicUrl = r.publicUrl;
        const bucket = bucketFromUrl(publicUrl) || "naan_muthalvan_beez";
        const objectPath = r.publicId || objectPathFromUrl(publicUrl);
        const ext = extFromPath(objectPath || publicUrl);
        const category = categoryFromExt(ext);
        const gcsUri = objectPath ? `gs://${bucket}/${objectPath}` : null;
        const fileName = objectPath ? objectPath.split("/").pop() : null;

        const exists = Resources.findOne({
          sessionId: sess._id,
          $or: [{ publicUrl }, ...(gcsUri ? [{ gcsUri }] : [])],
        });

        if (exists) {
          print(`  ↪️ Resource exists (skip): ${r.title}`);
          continue;
        }

        Resources.insertOne({
          sessionId: sess._id,
          title: r.title,
          description: "",
          type: "file",
          storageProvider: "gcs",
          gcsBucket: bucket,
          gcsObjectPath: objectPath,
          gcsUri,
          publicUrl,
          originalFileName: fileName || r.title,
          mimeType: mimeFromExt(ext),
          sizeBytes: r.bytes || null,
          fileExt: ext || null,
          category,
          url: publicUrl, // legacy
          fileName,
          isActive: true,
          createdAt: now(),
          updatedAt: now(),
        });

        print(`  ✅ Inserted Resource: ${r.title}`);
      }
    }
  }

  // ====== 4) Counters ======
  const totalSubjects = Subjects.countDocuments({ courseId: course._id });
  Courses.updateOne(
    { _id: course._id },
    { $set: { totalSubjects, updatedAt: now() } }
  );

  const subjectList = Subjects.find({ courseId: course._id }, { _id: 1 }).toArray();
  for (const s of subjectList) {
    const totalSessions = Sessions.countDocuments({ subjectId: s._id });
    Subjects.updateOne(
      { _id: s._id },
      { $set: { totalSessions, updatedAt: now() } }
    );
  }

  print("====================================");
  print("✅ Arts & Science seed completed.");
  print(`CenterId: ${center._id}`);
  print(`CourseId: ${course._id}`);
  print(`totalSubjects: ${totalSubjects}`);
  print("====================================");
})();
