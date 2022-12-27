import db from "../../database/index.js";

class WorksRepository {
  async findAll() {
    const row = await db.query(`
    SELECT * FROM works
  `);
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `
      SELECT * FROM works
      WHERE id = $1
    `,
      values: [id],
    });
    return row;
  }
  async create(user) {
    const {
      parede,
      requi,
      operacao,
      turno,
      ter,
      funcao,
      forma,
      navio,
      ber,
      cais,
      requisitante,
      status,
      user_id,
    } = user;
    const [row] = await db.query({
      text: `
      INSERT INTO works
      (parede, requi, operacao, turno, ter, funcao, forma, navio, ber, cais, requisitante,
        status, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
      values: [
        parede,
        requi,
        operacao,
        turno,
        ter,
        funcao,
        forma,
        navio,
        ber,
        cais,
        requisitante,
        status,
        user_id,
      ],
    });

    return row;
  }
  async update(id, data) {
    const {
      parede,
      requi,
      operacao,
      turno,
      ter,
      funcao,
      forma,
      navio,
      ber,
      cais,
      requisitante,
      status,
      user_id,
    } = data;

    const [row] = await db.query({
      text: `
      UPDATE works
      SET
      parede = $1, 
      requi = $2, 
      operacao = $3, 
      turno = $4, 
      ter = $5, 
      funcao = $6, 
      forma = $7, 
      navio = $8, 
      ber = $9, 
      cais = $10, 
      requisitante = $11,
      status = $12, 
      user_id = $13
      WHERE id = $14
      RETURNING *
    `,
      values: [
        parede,
        requi,
        operacao,
        turno,
        ter,
        funcao,
        forma,
        navio,
        ber,
        cais,
        requisitante,
        status,
        user_id,
        id,
      ],
    });
    return row;
  }
  async delete(id) {
    const deleteOperation = db.query({
      text: `
      DELETE FROM works
      WHERE id = $1
    `,
      values: [id],
    });
    return deleteOperation;
  }
}

export default new WorksRepository();
