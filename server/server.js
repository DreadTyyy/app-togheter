const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
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
          if (err) return res.json({ status: "error", message: err });
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
  const sql = "SELECT * FROM questions ORDER BY created_at";
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
    "SELECT answers.id AS id_answer, answers.id_user AS authAnswer, answers.body AS answer, answers.created_at AS answer_date FROM questions JOIN answers ON questions.id = answers.id_question WHERE questions.id = ? ORDER BY answer_date DESC";

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

const uploadImage = (req, res, next) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  const decodedFileName = decodeURIComponent(fileName);
  const uniqueFileName = Date.now() + "-" + path.basename(decodedFileName);
  uploadFile.mv(`${__dirname}/uploads/${uniqueFileName}`, function (err) {
    if (err) {
      console.log(err);
      console.log(__dirname);
      return res.json({
        status: "error",
        message: "Failed to add new blog w image",
      });
    }

    req.imageUrl = `${uniqueFileName}`;
    next();
  });
};

app.use("/images", express.static(path.join(__dirname, "uploads")));

// add new blog
app.post("/blogs", verifyUser, uploadImage, (req, res) => {
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

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/", () => {
  console.log("listening /");
});

app.listen(port, () => {
  console.log("listening");
  console.log("with " + port);
});
