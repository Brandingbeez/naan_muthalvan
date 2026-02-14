// // seed_paramedical_nursing.js
// // Run: mongosh "mongodb://localhost:27017/lms" seed_paramedical_nursing.js

// (function () {
//   // ====== CONFIG ======
//   const CENTER_ID = ObjectId("698f9ae1a8727040d6d0eb4c"); // Paramedical center (already exists)
//   const COURSE_TITLE = "Paramedical";
//   const COURSE_DESC = "";
//   const COURSE_LANGUAGE = "english";
//   const COURSE_TYPE = "online";
//   const COURSE_IMAGE = "";

//   // If you want fixed code, set it here. Otherwise auto-generates unique courseCode.
//   const FIXED_COURSE_CODE = null; // e.g. "PARAMEDICAL_NURSING_001"

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
//     for (let i = 0; i < 20; i++) {
//       const code = `${base}_COURSE_${randomCode()}`;
//       const exists = Courses.findOne({ courseCodeLower: code.toLowerCase() }, { _id: 1 });
//       if (!exists) return code;
//     }
//     return `${base}_COURSE_${Date.now()}`;
//   };

//   const sessionNumberFromTitle = (t) => {
//     const m = String(t || "").match(/(\d+)/);
//     return m ? Number(m[1]) : 1;
//   };

//   const bucketFromUrl = (url) => {
//     try {
//       const u = new URL(url);
//       const parts = u.pathname.split("/").filter(Boolean);
//       return parts[0] || null;
//     } catch {
//       return null;
//     }
//   };

//   const objectPathFromUrl = (url) => {
//     try {
//       const u = new URL(url);
//       const parts = u.pathname.split("/").filter(Boolean);
//       return parts.slice(1).join("/") || null;
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

//   // ====== DATA ======
//   const SUBJECT_TITLE = "Communicative English for Nursing";

//   const SESSIONS_DATA = [
//     {
//       title: "Session 1",
//       resources: [
//         {
//           title: "nursing_communication_session1_20251227165446",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_1/1770978314433-1752555-nursing_communication_session1_20251227165446.pptx",
//           bytes: 849244,
//           publicId:
//             "lms/ppts/paramedical/session_1/1770978314433-1752555-nursing_communication_session1_20251227165446.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 2",
//       resources: [
//         {
//           title: "communicative_english_nursing_session_2_20251227172335",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_2/1770978355918-354357262-communicative_english_nursing_session_2_20251227172335.pptx",
//           bytes: 735965,
//           publicId:
//             "lms/ppts/paramedical/session_2/1770978355918-354357262-communicative_english_nursing_session_2_20251227172335.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 3",
//       resources: [
//         {
//           title: "nursing_session_3_stress_intonation_20251227174830",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_3/1770978383938-322918419-nursing_session_3_stress_intonation_20251227174830.pptx",
//           bytes: 1899199,
//           publicId:
//             "lms/ppts/paramedical/session_3/1770978383938-322918419-nursing_session_3_stress_intonation_20251227174830.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 4",
//       resources: [
//         {
//           title: "nursing_session_4_reading_skills_20251227181929",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_4/1770978416738-576912833-nursing_session_4_reading_skills_20251227181929.pptx",
//           bytes: 910202,
//           publicId:
//             "lms/ppts/paramedical/session_4/1770978416738-576912833-nursing_session_4_reading_skills_20251227181929.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 5",
//       resources: [
//         {
//           title: "nursing_english_session5_writing_skills_20251227184433",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_5/1770978444972-409479697-nursing_english_session5_writing_skills_20251227184433.pptx",
//           bytes: 708080,
//           publicId:
//             "lms/ppts/paramedical/session_5/1770978444972-409479697-nursing_english_session5_writing_skills_20251227184433.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 6",
//       resources: [
//         {
//           title: "nursing_english_session_6_attentive_listening_20260107190537",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_6/1770978472169-726214917-nursing_english_session_6_attentive_listening_20260107190537.pptx",
//           bytes: 4214624,
//           publicId:
//             "lms/ppts/paramedical/session_6/1770978472169-726214917-nursing_english_session_6_attentive_listening_20260107190537.pptx",
//         },
//       ],
//     },
//     {
//       title: "Session 7",
//       resources: [
//         {
//           title: "Session 7 Nursing-Practice-Series",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_7/1770978686633-867953654-Session_7_Nursing-Practice-Series.pdf",
//           bytes: 50685007,
//           publicId:
//             "lms/ppts/paramedical/session_7/1770978686633-867953654-Session_7_Nursing-Practice-Series.pdf",
//         },
//       ],
//     },
//     {
//       title: "Session 8",
//       resources: [
//         {
//           title: "SESSION-8-ATTENTIVE-LISTENING",
//           publicUrl:
//             "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_8/1770978764278-659664500-SESSION-8-ATTENTIVE-LISTENING.pdf",
//           bytes: 50428464,
//           publicId:
//             "lms/ppts/paramedical/session_8/1770978764278-659664500-SESSION-8-ATTENTIVE-LISTENING.pdf",
//         },
//       ],
//     },
//   ];

//   // ====== UPSERT-LIKE INSERTS ======

//   // Course
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

//   // Subject
//   let subject = Subjects.findOne({ courseId: course._id, title: SUBJECT_TITLE });
//   if (!subject) {
//     const ins = Subjects.insertOne({
//       courseId: course._id,
//       title: SUBJECT_TITLE,
//       content: "",
//       isActive: true,
//       totalSessions: 0,
//       createdAt: now(),
//       updatedAt: now(),
//     });
//     subject = Subjects.findOne({ _id: ins.insertedId });
//     print(`✅ Created Subject: ${subject.title} (${subject._id})`);
//   } else {
//     print(`ℹ️ Subject exists: ${subject.title} (${subject._id})`);
//   }

//   // Sessions + Resources
//   for (const sessData of SESSIONS_DATA) {
//     const sessionNumber = sessionNumberFromTitle(sessData.title);

//     let session = Sessions.findOne({ subjectId: subject._id, sessionNumber });
//     if (!session) {
//       const ins = Sessions.insertOne({
//         subjectId: subject._id,
//         title: sessData.title,
//         description: "",
//         sessionNumber,
//         isActive: true,
//         createdAt: now(),
//         updatedAt: now(),
//       });
//       session = Sessions.findOne({ _id: ins.insertedId });
//       print(`✅ Created Session: ${session.title} (#${sessionNumber}) (${session._id})`);
//     } else {
//       print(`ℹ️ Session exists: ${session.title} (#${sessionNumber}) (${session._id})`);
//     }

//     for (const r of sessData.resources) {
//       const publicUrl = r.publicUrl;
//       const bucket = bucketFromUrl(publicUrl) || "naan_muthalvan_beez";
//       const objectPath = r.publicId || objectPathFromUrl(publicUrl);
//       const ext = extFromPath(objectPath || publicUrl);
//       const category = categoryFromExt(ext);
//       const gcsUri = objectPath ? `gs://${bucket}/${objectPath}` : null;
//       const fileName = objectPath ? objectPath.split("/").pop() : null;

//       const exists = Resources.findOne({
//         sessionId: session._id,
//         $or: [{ publicUrl }, ...(gcsUri ? [{ gcsUri }] : [])],
//       });

//       if (exists) {
//         print(`  ↪️ Resource exists (skip): ${r.title}`);
//         continue;
//       }

//       Resources.insertOne({
//         sessionId: session._id,
//         title: r.title,
//         description: "",
//         type: "file",
//         storageProvider: "gcs",
//         gcsBucket: bucket,
//         gcsObjectPath: objectPath,
//         gcsUri,
//         publicUrl,
//         originalFileName: fileName || r.title,
//         mimeType: mimeFromExt(ext),
//         sizeBytes: r.bytes || null,
//         fileExt: ext || null,
//         category,
//         url: publicUrl,
//         fileName,
//         isActive: true,
//         createdAt: now(),
//         updatedAt: now(),
//       });

//       print(`  ✅ Inserted Resource: ${r.title}`);
//     }
//   }

//   // Counters
//   const totalSubjects = Subjects.countDocuments({ courseId: course._id });
//   Courses.updateOne(
//     { _id: course._id },
//     { $set: { totalSubjects, updatedAt: now() } }
//   );

//   const totalSessions = Sessions.countDocuments({ subjectId: subject._id });
//   Subjects.updateOne(
//     { _id: subject._id },
//     { $set: { totalSessions, updatedAt: now() } }
//   );

//   print("====================================");
//   print("✅ Paramedical Nursing seed completed.");
//   print(`CourseId: ${course._id}`);
//   print(`SubjectId: ${subject._id}`);
//   print(`totalSubjects: ${totalSubjects}`);
//   print(`totalSessions: ${totalSessions}`);
//   print("====================================");
// })();




// seed_paramedical_nursing_new.js
// Run: mongosh "mongodb://localhost:27017/lms" seed_paramedical_nursing_new.js

(function () {
  // ====== CONFIG ======
  const CENTER_NAME = "Paramedical";
  const CENTER_DESC = "Paramedical related Courses";
  const CENTER_IMAGE = "";

  const COURSE_TITLE = "Paramedical";
  const COURSE_DESC = "";
  const COURSE_LANGUAGE = "english";
  const COURSE_TYPE = "online";
  const COURSE_IMAGE = "";

  const SUBJECT_TITLE = "Communicative English for Nursing";

  // If you want fixed code, set it here. Otherwise auto-generates unique courseCode.
  const FIXED_COURSE_CODE = null; // e.g. "PARAMEDICAL_NURSING_001"

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
      const code = `${base}_COURSE_${randomCode()}`;
      const exists = Courses.findOne({ courseCodeLower: code.toLowerCase() }, { _id: 1 });
      if (!exists) return code;
    }
    return `${base}_COURSE_${Date.now()}`;
  };

  const sessionNumberFromTitle = (t) => {
    const m = String(t || "").match(/(\d+)/);
    return m ? Number(m[1]) : 1;
  };

  const bucketFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || null; // bucket
    } catch {
      return null;
    }
  };

  const objectPathFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.slice(1).join("/") || null; // path after bucket
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

  // ====== DATA ======
  const SESSIONS_DATA = [
    {
      title: "Session 1",
      resources: [
        {
          title: "nursing_communication_session1_20251227165446",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_1/1770978314433-1752555-nursing_communication_session1_20251227165446.pptx",
          bytes: 849244,
          publicId:
            "lms/ppts/paramedical/session_1/1770978314433-1752555-nursing_communication_session1_20251227165446.pptx",
        },
      ],
    },
    {
      title: "Session 2",
      resources: [
        {
          title: "communicative_english_nursing_session_2_20251227172335",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_2/1770978355918-354357262-communicative_english_nursing_session_2_20251227172335.pptx",
          bytes: 735965,
          publicId:
            "lms/ppts/paramedical/session_2/1770978355918-354357262-communicative_english_nursing_session_2_20251227172335.pptx",
        },
      ],
    },
    {
      title: "Session 3",
      resources: [
        {
          title: "nursing_session_3_stress_intonation_20251227174830",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_3/1770978383938-322918419-nursing_session_3_stress_intonation_20251227174830.pptx",
          bytes: 1899199,
          publicId:
            "lms/ppts/paramedical/session_3/1770978383938-322918419-nursing_session_3_stress_intonation_20251227174830.pptx",
        },
      ],
    },
    {
      title: "Session 4",
      resources: [
        {
          title: "nursing_session_4_reading_skills_20251227181929",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_4/1770978416738-576912833-nursing_session_4_reading_skills_20251227181929.pptx",
          bytes: 910202,
          publicId:
            "lms/ppts/paramedical/session_4/1770978416738-576912833-nursing_session_4_reading_skills_20251227181929.pptx",
        },
      ],
    },
    {
      title: "Session 5",
      resources: [
        {
          title: "nursing_english_session5_writing_skills_20251227184433",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_5/1770978444972-409479697-nursing_english_session5_writing_skills_20251227184433.pptx",
          bytes: 708080,
          publicId:
            "lms/ppts/paramedical/session_5/1770978444972-409479697-nursing_english_session5_writing_skills_20251227184433.pptx",
        },
      ],
    },
    {
      title: "Session 6",
      resources: [
        {
          title: "nursing_english_session_6_attentive_listening_20260107190537",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_6/1770978472169-726214917-nursing_english_session_6_attentive_listening_20260107190537.pptx",
          bytes: 4214624,
          publicId:
            "lms/ppts/paramedical/session_6/1770978472169-726214917-nursing_english_session_6_attentive_listening_20260107190537.pptx",
        },
      ],
    },
    {
      title: "Session 7",
      resources: [
        {
          title: "Session 7 Nursing-Practice-Series",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_7/1770978686633-867953654-Session_7_Nursing-Practice-Series.pdf",
          bytes: 50685007,
          publicId:
            "lms/ppts/paramedical/session_7/1770978686633-867953654-Session_7_Nursing-Practice-Series.pdf",
        },
      ],
    },
    {
      title: "Session 8",
      resources: [
        {
          title: "SESSION-8-ATTENTIVE-LISTENING",
          publicUrl:
            "https://storage.googleapis.com/naan_muthalvan_beez/lms/ppts/paramedical/session_8/1770978764278-659664500-SESSION-8-ATTENTIVE-LISTENING.pdf",
          bytes: 50428464,
          publicId:
            "lms/ppts/paramedical/session_8/1770978764278-659664500-SESSION-8-ATTENTIVE-LISTENING.pdf",
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

  // ====== 3) Create/Find Subject ======
  let subject = Subjects.findOne({ courseId: course._id, title: SUBJECT_TITLE });
  if (!subject) {
    const ins = Subjects.insertOne({
      courseId: course._id,
      title: SUBJECT_TITLE,
      content: "",
      isActive: true,
      totalSessions: 0,
      createdAt: now(),
      updatedAt: now(),
    });
    subject = Subjects.findOne({ _id: ins.insertedId });
    print(`✅ Created Subject: ${subject.title} (${subject._id})`);
  } else {
    print(`ℹ️ Subject exists: ${subject.title} (${subject._id})`);
  }

  // ====== 4) Sessions + Resources ======
  for (const sessData of SESSIONS_DATA) {
    const sessionNumber = sessionNumberFromTitle(sessData.title);

    let session = Sessions.findOne({ subjectId: subject._id, sessionNumber });
    if (!session) {
      const ins = Sessions.insertOne({
        subjectId: subject._id,
        title: sessData.title,
        description: "",
        sessionNumber,
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      });
      session = Sessions.findOne({ _id: ins.insertedId });
      print(`✅ Created Session: ${session.title} (#${sessionNumber}) (${session._id})`);
    } else {
      print(`ℹ️ Session exists: ${session.title} (#${sessionNumber}) (${session._id})`);
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
        sessionId: session._id,
        $or: [{ publicUrl }, ...(gcsUri ? [{ gcsUri }] : [])],
      });

      if (exists) {
        print(`  ↪️ Resource exists (skip): ${r.title}`);
        continue;
      }

      Resources.insertOne({
        sessionId: session._id,
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

  // ====== 5) Counters ======
  const totalSubjects = Subjects.countDocuments({ courseId: course._id });
  Courses.updateOne(
    { _id: course._id },
    { $set: { totalSubjects, updatedAt: now() } }
  );

  const totalSessions = Sessions.countDocuments({ subjectId: subject._id });
  Subjects.updateOne(
    { _id: subject._id },
    { $set: { totalSessions, updatedAt: now() } }
  );

  print("====================================");
  print("✅ Paramedical Nursing seed completed.");
  print(`CenterId: ${center._id}`);
  print(`CourseId: ${course._id}`);
  print(`SubjectId: ${subject._id}`);
  print(`totalSubjects: ${totalSubjects}`);
  print(`totalSessions: ${totalSessions}`);
  print("====================================");
})();
