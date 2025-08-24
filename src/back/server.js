import express from "express";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/usuarios", async (req, res) => {
  let users = [];

  if (req.query) {
    users = await Prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age,
      },
    });
  } else {
    users = await Prisma.user.findMany();
  }
  res.status(200).json(users);
});

app.post("/usuarios", async (req, res) => {
  try {
    const novoUsuario = await Prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      usuario: novoUsuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  await Prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(201).json(req.body);
});

app.delete("/usuarios/:id", async (req, res) => {
  await Prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(204).send({ message: "Usuário deletado com sucesso!" });
});

app.listen(3010, () => {
  console.log("ta rodando carai http://localhost:3010");
});
