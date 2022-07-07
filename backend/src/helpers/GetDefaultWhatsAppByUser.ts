import User from "../models/User";
import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";

const GetDefaultWhatsAppByUser = async (
  userId: number, companyId: number
): Promise<Whatsapp | null> => {
  const user2: any = await User.findAll({
    where: { id: userId, companyId: companyId }
  });

  const user = user2.dataValues;

  console.log(user)

  if (user === null || user === undefined) {
    return null;
  }

  if (user.whatsapp !== undefined) {
    logger.info(`Found whatsapp linked to user '${user.name}' is '${user.whatsapp.name}'.`);
  }

  return user.whatsapp;
};

export default GetDefaultWhatsAppByUser;
