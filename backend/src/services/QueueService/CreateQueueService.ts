import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

interface QueueData {
  name: string;
  color: string;
  greetingMessage?: string;
  companyId: number;
}

const CreateQueueService = async (queueData: QueueData): Promise<Queue> => {
  const { color, name } = queueData;

  const queueSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "ERR_QUEUE_INVALID_NAME")
      .required("ERR_QUEUE_INVALID_NAME")
      .test(
        "Check-unique-name",
        "ERR_QUEUE_NAME_ALREADY_EXISTS",
        async value => {
          if (value) {
            const queueWithSameName = await Queue.findOne({
              where: { name: value, color, companyId: queueData.companyId }
            });

            return !queueWithSameName;
          }
          return false;
        }
      )
  });

  try {
    await queueSchema.validate({ color, name });
  } catch (err: any) {
    throw new AppError(err.message);
  }
  const queue = await Queue.create(queueData);

  return queue;
};

export default CreateQueueService;
