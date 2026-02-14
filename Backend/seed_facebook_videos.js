// seed_facebook_videos.js
// Run: mongosh "mongodb://localhost:27017/lms" seed_facebook_videos.js

(function () {
  // ====== CONFIG ======
  const CENTER_NAME = "Facebook";
  const CENTER_DESC = "";
  const CENTER_IMAGE = "";

  const COURSE_TITLE = "Facebook";
  const COURSE_DESC = "";
  const COURSE_LANGUAGE = "english";
  const COURSE_TYPE = "online";
  const COURSE_IMAGE = "";

  // Set this if you want fixed unique code; otherwise it auto generates
  const FIXED_COURSE_CODE = null; // e.g. "FACEBOOK_001"

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
      const code = `${base}_${randomCode()}`;
      const exists = Courses.findOne({ courseCodeLower: code.toLowerCase() }, { _id: 1 });
      if (!exists) return code;
    }
    return `${base}_${Date.now()}`;
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
      return parts.slice(1).join("/") || null; // after bucket
    } catch {
      return null;
    }
  };

  const extFromPath = (p) => {
    if (!p) return "";
    const i = p.lastIndexOf(".");
    return i >= 0 ? p.slice(i + 1).toLowerCase() : "";
  };

  const mimeFromExt = (ext) => {
    if (ext === "mp4") return "video/mp4";
    if (ext === "webm") return "video/webm";
    return "application/octet-stream";
  };

  const now = () => new Date();

  // ====== DATA ======
  // Each item will become: Subject(title=Video X) -> Session(#1) -> Resource(video mp4)
  const FACEBOOK_DATA = [
    {
      subjectTitle: "Video 1",
      sessionTitle: "Facebook Pixel and Setting Up Custom Conversions",
      video: {
        title: "01-Facebook Pixel and Setting Up Custom Conversions",
        publicUrl:
          "https://storage.googleapis.com/naan_muthalvan_beez/lms/videos/facebook/facebook_pixel_and_setting_up_custom_conversions/1769185069913-292332883-01-Facebook_Pixel_and_Setting_Up_Custom_Conversions.mp4",
        publicId:
          "lms/videos/facebook/facebook_pixel_and_setting_up_custom_conversions/1769185069913-292332883-01-Facebook_Pixel_and_Setting_Up_Custom_Conversions.mp4",
        bytes: 462658326,
      },
    },
    {
      subjectTitle: "Video 2",
      sessionTitle: "How Lookalike Audiences Can Supercharge Your Facebook Campaigns",
      video: {
        title: "02-How Lookalike Audiences Can Supercharge Your Facebook Campaigns",
        publicUrl:
          "https://storage.googleapis.com/naan_muthalvan_beez/lms/videos/facebook/how_lookalike_audiences_can_supercharge_your_facebook_campaigns/1769185213530-138334795-02-How_Lookalike_Audiences_Can_Supercharge_Your_Facebook_Campaigns.mp4",
        publicId:
          "lms/videos/facebook/how_lookalike_audiences_can_supercharge_your_facebook_campaigns/1769185213530-138334795-02-How_Lookalike_Audiences_Can_Supercharge_Your_Facebook_Campaigns.mp4",
        bytes: 404777428,
      },
    },
    {
      subjectTitle: "Video 3",
      sessionTitle: "Creating Dynamic Ad Campaigns in Facebook",
      video: {
        title: "03-Creating Dynamic Ad Campaigns in Facebook",
        publicUrl:
          "https://storage.googleapis.com/naan_muthalvan_beez/lms/videos/facebook/creating_dynamic_ad_campaigns_in_facebook/1769185325543-889388506-03-Creating_Dynamic_Ad_Campaigns_in_Facebook.mp4",
        publicId:
          "lms/videos/facebook/creating_dynamic_ad_campaigns_in_facebook/1769185325543-889388506-03-Creating_Dynamic_Ad_Campaigns_in_Facebook.mp4",
        bytes: 655677568,
      },
    },
    {
      subjectTitle: "Video 4",
      sessionTitle: "What Facebook Wants from its Advertisers",
      video: {
        title: "04-What Facebook Wants from its Advertisers",
        publicUrl:
          "https://storage.googleapis.com/naan_muthalvan_beez/lms/videos/facebook/what_facebook_wants_from_its_advertisers/1769185535195-427374325-04-What_Facebook_Wants_from_its_Advertisers.mp4",
        publicId:
          "lms/videos/facebook/what_facebook_wants_from_its_advertisers/1769185535195-427374325-04-What_Facebook_Wants_from_its_Advertisers.mp4",
        bytes: 285240775,
      },
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

  // ====== 3) Insert Subjects + Sessions + Resources ======
  for (const item of FACEBOOK_DATA) {
    // Subject = Video 1/2/3/4
    let subject = Subjects.findOne({ courseId: course._id, title: item.subjectTitle });
    if (!subject) {
      const ins = Subjects.insertOne({
        courseId: course._id,
        title: item.subjectTitle,
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

    // One session per subject (sessionNumber=1)
    let session = Sessions.findOne({ subjectId: subject._id, sessionNumber: 1 });
    if (!session) {
      const ins = Sessions.insertOne({
        subjectId: subject._id,
        title: item.sessionTitle,
        description: "",
        sessionNumber: 1,
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      });
      session = Sessions.findOne({ _id: ins.insertedId });
      print(`✅ Created Session: ${session.title} (#1) (${session._id})`);
    } else {
      // if exists but title differs, keep existing (or you can update)
      print(`ℹ️ Session exists: ${session.title} (#1) (${session._id})`);
    }

    // Resource: video file
    const publicUrl = item.video.publicUrl;
    const bucket = bucketFromUrl(publicUrl) || "naan_muthalvan_beez";
    const objectPath = item.video.publicId || objectPathFromUrl(publicUrl);
    const ext = extFromPath(objectPath || publicUrl);
    const gcsUri = objectPath ? `gs://${bucket}/${objectPath}` : null;
    const fileName = objectPath ? objectPath.split("/").pop() : null;

    const exists = Resources.findOne({
      sessionId: session._id,
      $or: [{ publicUrl }, ...(gcsUri ? [{ gcsUri }] : [])],
    });

    if (exists) {
      print(`  ↪️ Resource exists (skip): ${item.video.title}`);
    } else {
      Resources.insertOne({
        sessionId: session._id,
        title: item.video.title,
        description: "",
        type: "file",
        storageProvider: "gcs",
        gcsBucket: bucket,
        gcsObjectPath: objectPath,
        gcsUri,
        publicUrl,
        originalFileName: fileName || item.video.title,
        mimeType: mimeFromExt(ext),
        sizeBytes: item.video.bytes || null,
        fileExt: ext || null,
        category: "video",
        url: publicUrl, // legacy
        fileName,
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      });
      print(`  ✅ Inserted Video Resource: ${item.video.title}`);
    }

    // update subject counter (1 session)
    const totalSessions = Sessions.countDocuments({ subjectId: subject._id });
    Subjects.updateOne(
      { _id: subject._id },
      { $set: { totalSessions, updatedAt: now() } }
    );
  }

  // ====== 4) Update course counter ======
  const totalSubjects = Subjects.countDocuments({ courseId: course._id });
  Courses.updateOne(
    { _id: course._id },
    { $set: { totalSubjects, updatedAt: now() } }
  );

  print("====================================");
  print("✅ Facebook seed completed.");
  print(`CenterId: ${center._id}`);
  print(`CourseId: ${course._id}`);
  print(`totalSubjects: ${totalSubjects}`);
  print("====================================");
})();
