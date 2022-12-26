import db from "../../database/index.js";

class WorksRepository {
  async findAll() {
    const row = await db.query(`
    SELECT * FROM work_request
  `);
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `
      SELECT * FROM work_request
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
      worker_id,
    } = user;
    const [row] = await db.query({
      text: `
      INSERT INTO work_request
      (parede, requi, operacao, turno, ter, funcao, forma, navio, ber, cais, requisitante,
        status, worker_id)
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
        worker_id,
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
      worker_id,
    } = data;

    const [row] = await db.query({
      text: `
      UPDATE work_request
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
      worker_id = $13
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
        worker_id,
        id,
      ],
    });
    return row;
  }
  async delete(id) {
    const deleteOperation = db.query({
      text: `
      DELETE FROM work_request
      WHERE id = $1
    `,
      values: [id],
    });
    return deleteOperation;
  }
}

export default new WorksRepository();
