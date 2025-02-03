import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const client = new SSMClient();

export const getSSMParameter = async (paramName: string) => {
  try {
    const command = new GetParameterCommand({
      Name: paramName,
      WithDecryption: true,
    });

    const response = await client.send(command);
    return response?.Parameter?.Value;
  } catch (error) {
    console.error('Error retrieving parameter:', error);
  }
};
