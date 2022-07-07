import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { createAccessToken } from "../../helpers/CreateTokens";
import Company from "../../models/Company";
import Setting from "../../models/Setting";
import User from "../../models/User";

interface UserData {
  email?: string;
  passwordDefault?: string;
  name?: string;
  numberAttendants?: string;
  numberConections: number
}

interface Request {
  Data: UserData;
}

interface Response {
  company: Company;
  token: string;
}

const UpdateUserService = async ({ Data
}: Request): Promise<Response> => {

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    passwordDefault: Yup.string().required()
  });

  const { email, passwordDefault, numberAttendants, name, numberConections } = Data;

  try {
    await schema.validate({ email, passwordDefault, numberAttendants, name, numberConections });
  } catch (err: any) {
    throw new AppError(err.message);
  }
  console.info(Data)
  const user = await Company.create({
    email,
    passwordDefault,
    numberAttendants,
    name,
    numberConections
  });

  await user.reload();

  const temp = await User.create(
    {
      email,
      password: passwordDefault,
      name,
      profile: 'user',
      whatsappId: null,
      companyId: user.id
    },
    { include: ["queues", "whatsapp"] }
  );

  const temp2 = await Setting.create({
    key: `userApiToken-${user.id}`,
    value: createAccessToken(temp),
    companyId: user.id
  })

  return {
    company: user,
    token: temp2.value
  };
};

export default UpdateUserService;
