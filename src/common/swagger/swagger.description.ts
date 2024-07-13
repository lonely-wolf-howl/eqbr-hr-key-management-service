import { COMMON_ERRORS } from 'src/common/errors/common.errors';
import { DOMAIN_ERRORS } from 'src/common/errors/domain.errors';

const ALL_ERRORS = { ...COMMON_ERRORS, ...DOMAIN_ERRORS };

const maxLengths = {
  errorCode: Math.max(
    'Error Code'.length,
    ...Object.values(ALL_ERRORS).map((error) => error.errorCode.length),
  ),
  statusCode: Math.max(
    'Status Code'.length,
    ...Object.values(ALL_ERRORS).map(
      (error) => error.statusCode.toString().length,
    ),
  ),
  message: Math.max(
    'Message'.length,
    ...Object.values(ALL_ERRORS).map((error) => error.message.length),
  ),
};

const centerAlign = (str: string, length: number) => {
  const totalPadding = length - str.length;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return ' '.repeat(leftPadding) + str + ' '.repeat(rightPadding);
};

const header = `| ${centerAlign('Error Code', maxLengths.errorCode)} | ${centerAlign('Status Code', maxLengths.statusCode)} | ${centerAlign('Message', maxLengths.message)}  |`;
const separator = `|-${'-'.repeat(maxLengths.errorCode)}-|-${'-'.repeat(maxLengths.statusCode)}-|-${'-'.repeat(maxLengths.message)}- |`;

const errorMessages = Object.keys(ALL_ERRORS)
  .map(
    (key) =>
      `| ${centerAlign(ALL_ERRORS[key].errorCode, maxLengths.errorCode)} | ${centerAlign(ALL_ERRORS[key].statusCode.toString(), maxLengths.statusCode)} | ${centerAlign(ALL_ERRORS[key].message, maxLengths.message)}  |`,
  )
  .join('\n');

export const swaggerDescription = `
### FRAMEWORK 기능 개발을 위한 API 문서입니다.

**HTTP Response Status Code는 각각의 Endpoint별로 상이하니 참고하시기 바랍니다.**

**Error 발생 시 errorCode, message는 HTTP Response Body에 제공됩니다.**

**아래 Error Code와 Message를 참고하여 개발을 진행하시기 바랍니다.**

---

\`\`\`markdown
${header}
${separator}
${errorMessages}
\`\`\`
`;
