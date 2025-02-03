import { IS_OFFLINE } from '@/config';
import dynamoose from 'dynamoose';

if (IS_OFFLINE) {
  dynamoose.aws.ddb.local(process.env.DATABASE);
}

export default dynamoose;
