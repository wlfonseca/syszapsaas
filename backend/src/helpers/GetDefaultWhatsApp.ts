import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";
import GetDefaultWhatsAppByUser from "./GetDefaultWhatsAppByUser";

const GetDefaultWhatsApp = async (
  userId: number, companyId: number
): Promise<Whatsapp> => {
  if (userId > 0) {
    const whatsappByUser =
      await GetDefaultWhatsAppByUser(userId, companyId!);
    if (whatsappByUser !== null) {
      return whatsappByUser;
    }
  }

  const defaultWhatsapp1 = await Whatsapp.findOne({
    where: { isDefault: true, companyId: companyId }
  });

  if (!defaultWhatsapp1) {
    const defaultWhatsapp = await Whatsapp.findOne({
      where: { companyId: companyId }
    });

    if (!defaultWhatsapp) {
      throw new AppError("ERR_NO_DEF_WAPP_FOUND");
    } else {
      return defaultWhatsapp;
    }
  } else {
    return defaultWhatsapp1;
  }
};

export default GetDefaultWhatsApp;
