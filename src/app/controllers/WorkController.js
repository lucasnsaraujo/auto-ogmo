import WorksRepository from "../repositories/WorksRepository.js";

class WorkController {
  async index(request, response) {
    const works = await WorksRepository.findAll();
    return response.status(200).json(works);
  }

  async show(request, response) {
    const { id } = request.params;
    const work = await WorksRepository.findById(id);
    if (work) {
      return response.status(200).json(work);
    } else {
      return response.status(400).json({ error: "Work not found" });
    }
  }
  async store(request, response) {
    const data = request.body;
    const isBodyValid = checkIfHasAllParameters(data);
    if (isBodyValid) {
      const work = await WorksRepository.create(data);
      return response.status(201).json(work);
    } else {
      return response.status(400).json({ error: "Invalid payload" });
    }
  }
  async update(request, response) {
    const { id } = request.params;
    const data = request.body;
    const isBodyValid = checkIfHasAllParameters(data);
    if (isBodyValid) {
      const work = await WorksRepository.update(id, data);
      return response.status(200).json(work);
    } else {
      return response.status(400).json({ error: "Invalid payload" });
    }
  }
  async delete(request, response) {
    const { id } = request.params;
    await WorksRepository.delete(id);
    return response.sendStatus(200);
  }
}

function checkIfHasAllParameters(data) {
  const hasNullItems = Object.keys(data).filter(
    (item) => data?.[item] === null || typeof data?.[item] === "undefined"
  ).length;
  const hasAllItems = Object.keys(data).length === USER_MODEL.length;
  if (hasAllItems && !hasNullItems) {
    return true;
  }
  return false;
}
const USER_MODEL = [
  "parede",
  "requi",
  "operacao",
  "turno",
  "ter",
  "funcao",
  "forma",
  "navio",
  "ber",
  "cais",
  "requisitante",
  "status",
];

export default new WorkController();
