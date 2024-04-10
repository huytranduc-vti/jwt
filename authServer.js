import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = 5500;

app.use(express.json());

let refreshTokens = [];

const accounts = [
  {
    id: 1,
    username: "Duc Huy",
    /// 123456
    password: "$2b$10$cdxZzLicQaZVpsrQAtRPUO6B2FrvHViGB5CVH9I8qvkHC.f/LuoYi",
  },
  {
    id: 2,
    username: "Duc Dat",
    password: "$2b$10$cdxZzLicQaZVpsrQAtRPUO6B2FrvHViGB5CVH9I8qvkHC.f/LuoYi",
  },
  {
    id: 3,
    username: "Minh Hieu",
    password: "$2b$10$cdxZzLicQaZVpsrQAtRPUO6B2FrvHViGB5CVH9I8qvkHC.f/LuoYi",
  },
  {
    id: 4,
    username: "Hai Nam",
    password: "$2b$10$cdxZzLicQaZVpsrQAtRPUO6B2FrvHViGB5CVH9I8qvkHC.f/LuoYi",
  },
];

app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );
    res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  // Authentication
  // Authorization
  // { username: 'Test' }
  const data = req.body;
  console.log({ data });
  let accountInfo = accounts.find(
    (account) => account.username === data.username
  );
  if (accountInfo) {
    bcrypt.compare(data.password, accountInfo.password, (err, result) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30s",
        });
        const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
      }
    });
  } else {
    res.sendStatus(403);
  }
});

app.post("/logout", (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
