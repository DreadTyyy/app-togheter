const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config();
const { put } = require("@vercel/blob");
const { list } = require("@vercel/blob");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    uriDecodeFileNames: true,
  })
);

const port = process.env.PORT || 3307;

const hostname = process.env.DB_HOSTNAME_URL;
const databaseUser = process.env.DB_USERNAME;
const databasePassword = process.env.DB_PASSWORD;
const databaseName = process.env.DB_DATABASE_NAME;
const databasePort = process.env.DB_DATABASE_PORT;

const db = mysql.createConnection({
  host: hostname,
  user: databaseUser,
  password: databasePassword,
  database: databaseName,
  port: databasePort,
});

const salt = 10;

const verifyUser = (req, res, next) => {
  const tokenWithBearer = req.headers.authorization;
  const token = tokenWithBearer.slice(7);

  if (!token) {
    return res.json({ status: "error", message: "Should provide token." });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ status: "error", message: err });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

// vercel blob
// upload to blob databases
const uploadBlob = async (req, res, next) => {
  const form = await req.files;
  const formFile = form["file"];
  const type = formFile.mimetype.split("/")[1];

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let filename = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    filename += characters.charAt(randomIndex);
  }
  filename = filename + "." + type;

  const buffer = new Blob([formFile.data], { type: formFile.mimetype });

  const blob = await put(filename, buffer, {
    access: "public",
  });

  req.imageUrl = blob.url;
  next();
};

// download image from blob databases
app.get("/api/download", async (req, res) => {
  const { blobs } = await list();
  return res.json(blobs);
});

// upload to local directory
const uploadImage = (req, res, next) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  const decodedFileName = decodeURIComponent(fileName);
  const uniqueFileName = Date.now() + "-" + path.basename(decodedFileName);
  uploadFile.mv(`${__dirname}/uploads/${uniqueFileName}`, function (err) {
    if (err) {
      res.status(500).send(err);
      return res.json({
        error: err,
        status: "error",
        message: "Failed to add new blog w image",
      });
    }

    req.imageUrl = `${uniqueFileName}`;
    next();
  });
};

app.post("/api/upload", uploadBlob, (req, res) => {
  return res.status(500).send("Sudah bisa");
});

app.get("/users/me", verifyUser, (req, res) => {
  return res.json({ status: "success", username: req.username });
});

// login to server
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ? ";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ status: "error", message: err });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) {
            console.log(err);
            return res.json({ status: "error", message: "Login failed" });
          }
          if (response) {
            const username = data[0].username;
            const token = jwt.sign({ username }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            return res.json({
              status: "success",
              message: "login success",
              token: token,
            });
          } else {
            return res.json({
              status: "failed",
              message: "Password doesn't match",
            });
          }
        }
      );
    } else {
      return res.json({ status: "failed", message: "Email does't exist." });
    }
  });
});

// register account
app.post("/register", (req, res) => {
  try {
    const checkDuplicat = "SELECT * FROM users WHERE `username` = ?";
    db.query(checkDuplicat, [req.body.username], (err, data) => {
      if (err) return res.json({ status: "error", message: err });
      if (data.length > 0) {
        return res.json({
          status: "failed",
          message: "username has been used, try another!",
        });
      } else {
        const sql =
          "INSERT INTO users (`username`, `password`, `email`) VALUES (?)";
        bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
          if (err)
            return res.json({
              status: "error",
              message: "Error for hashing password",
            });
          const values = [req.body.username, hash, req.body.email];
          db.query(sql, [values], (err, data) => {
            if (err)
              return res.json({
                status: "error",
                message: "Error inserting data to server",
              });
            return res.json({
              status: "success",
              message: "new user has been created",
            });
          });
        });
      }
    });
  } catch (err) {
    return { status: "error", message: `ERROR: ${err}` };
  }
});

// get all questions
app.get("/questions", (req, res) => {
  const sql = "SELECT * FROM questions ORDER BY created_at DESC";
  db.query(sql, (err, data) => {
    if (err)
      return res.json({
        status: "error",
        message: "Failed to get data",
        data: null,
      });
    return res.json({
      status: "success",
      meesage: "Success get data",
      data: data,
    });
  });
});

// get detail question
const getQuestion = (req, res, next) => {
  const sqlQuestion =
    "SELECT id AS id_question, id_user AS author, title, is_answer, created_at AS question_date FROM questions WHERE id = ?";
  db.query(sqlQuestion, [req.params.id], (err, queryQuestion) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Failed to get question",
        data: null,
      });
    }
    if (queryQuestion.length > 0) {
      req.question = queryQuestion[0];
      next();
    } else {
      return res.json({
        status: "error",
        message: "Question not found",
        data: null,
      });
    }
  });
};

app.get("/question/:id", getQuestion, (req, res) => {
  if (req.question.is_answer !== "true") {
    return res.json({
      status: "success",
      message: "Success to get question",
      data: { question: req.question, answer: [] },
    });
  }
  const sqlAnswers =
    "SELECT answers.id AS id_answer, answers.id_user AS authAnswer, answers.body AS answer, answers.created_at AS answer_date FROM questions JOIN answers ON questions.id = answers.id_question WHERE questions.id = ?";

  db.query(sqlAnswers, [req.params.id], (err, queryAnswers) => {
    if (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "Failed to get Answers",
        data: null,
      });
    }
    if (queryAnswers.length > 0) {
      const result = {
        question: req.question,
        answers: queryAnswers,
      };
      return res.json({
        status: "success",
        message: "Success to get detail question",
        data: result,
      });
    } else {
      const result = {
        question: req.question,
        answers: [
          {
            answer: "Error Not Found Answer",
          },
        ],
      };
      return res.json({
        status: "success",
        message: "Success to get question",
        data: result,
      });
    }
  });
});

// add new questions
app.post("/questions", verifyUser, (req, res) => {
  const sql =
    "INSERT INTO questions (`id_user`, `title`, `is_answer`) VALUES (?)";
  const values = [req.username, req.body.title, "false"];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.json({ status: "error", message: err, data: null });
    }
    return res.json({
      status: "succes",
      message: "New question has been added",
      data: data,
    });
  });
});

// send new answer
app.post("/questions/answer", verifyUser, (req, res) => {
  const sql = "INSERT INTO answers (id_user, id_question, body) VALUES (?)";
  const sqlUpdate = "UPDATE questions SET is_answer = 'true' WHERE `id`=?";
  const values = [req.username, req.body.id_question, req.body.body];
  db.query(sql, [values], (err, data) => {
    if (err)
      return res.json({
        status: "error",
        message: "Failed to send an answer",
        data: null,
      });
    db.query(sqlUpdate, [req.body.id_question]);
    return res.json({
      status: "success",
      message: "Success to send an answer",
      data: data,
    });
  });
});

// get all blogs
app.get("/blogs", (req, res) => {
  const sql = "SELECT * FROM blogs ORDER BY created_at DESC";
  db.query(sql, (err, data) => {
    if (err)
      return res.json({
        status: "error",
        message: "Failed to get blogs",
        data: [],
      });
    return res.json({
      status: "success",
      message: "Success to get blogs",
      data: data,
    });
  });
});

// get detail blog
app.get("/blogs/:id", (req, res) => {
  const sql = "SELECT * FROM blogs WHERE `id` = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err)
      return res.json({
        status: "error",
        message: "Error to get blog",
        data: [],
      });
    if (data.length > 0) {
      return res.json({
        status: "success",
        message: "Success to get blog",
        data: data,
      });
    } else {
      return res.json({
        status: "failed",
        message: "Blog is not found",
        data: [],
      });
    }
  });
});

app.use("/images", express.static(path.join(__dirname, "uploads")));

// add new blog
app.post("/blogs", verifyUser, uploadBlob, (req, res) => {
  const sql =
    "INSERT INTO blogs (`id_user`, `image_blog`, `title`, `body`) VALUES (?)";
  values = [req.username, req.imageUrl, req.body.title, req.body.body];
  db.query(sql, [values], (err, data) => {
    if (err)
      return res.json({
        status: "error",
        message: "Failed to add new blog",
        data: null,
      });
    return res.json({
      status: "success",
      message: "New blog has been added",
      data: data,
    });
  });
});

// get all contest
app.get("/contests", (req, res) => {
  const sqlContest = "SELECT * FROM contests ORDER BY created_at DESC";
  db.query(sqlContest, (err, data) => {
    if (err)
      return res.json({
        status: "error",
        data: null,
        message: "Failed to get contests",
      });
    if (data.length > 0) {
      return res.json({
        status: "success",
        data: data,
        message: "Success to get contests",
      });
    } else {
      return res.json({
        status: "failed",
        data: [],
        message: "No contest found.",
      });
    }
  });
});

// get detail contest
app.get("/contests/:id", (req, res) => {
  const sql = "SELECT * FROM contests WHERE `id`=?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err)
      return res.json({
        status: "error",
        data: null,
        message: "Failed to get contest",
      });
    if (data.length > 0) {
      const querySubmit =
        "SELECT contests.id AS id_contest,submited.id AS id_submit, submited.id_user AS user_submit, submited.title AS submit_title, submited.description AS submit_description, submited.image AS submit_image, submited.created_at AS submit_date FROM contests JOIN submited ON contests.id = submited.id_contest WHERE contests.id=? ORDER BY submited.created_at DESC";
      if (data[0].submited > 0) {
        db.query(querySubmit, [req.params.id], (err, submitData) => {
          if (err)
            return res.json({
              status: "error",
              data: null,
              message: "Failed to get submit data",
            });
          return res.json({
            status: "success",
            message: "Success to get contest and submited",
            data: { data, item_submit: submitData },
          });
        });
      } else {
        return res.json({
          status: "success",
          message: "Success to get contest",
          data: { data, item_submit: [] },
        });
      }
    } else {
      return res.json({
        status: "failed",
        message: "Contest is not found",
        data: [],
      });
    }
  });
});

// send submit
app.post("/contests", verifyUser, uploadBlob, (req, res) => {
  const sql =
    "INSERT INTO submited (`id_contest`,`id_user`,`title`,`description`,`image`) VALUES (?)";
  const values = [
    req.body.id_contest,
    req.username,
    req.body.title,
    req.body.description,
    req.imageUrl,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json({
        status: "error",
        message: "Failed to submit",
        data: null,
      });
    }
    const updateSubmit =
      "UPDATE contests SET `submited`=`submited`+1 WHERE id=?";
    db.query(updateSubmit, [req.body.id_contest], (err, data) => {
      if (err) {
        return res.json({
          status: "error",
          message: "Failed to modified contest",
          data: null,
        });
      }
      return res.json({
        status: "success",
        message: "Submited success",
        data: data,
      });
    });
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/", (req, res) => {
  console.log("listening /");
  res.status(500).send("Hey this is my API running 🥳");
});

app.listen(port, () => {
  console.log("listening");
  console.log("with " + port);
});
