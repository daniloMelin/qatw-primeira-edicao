import { test, expect } from '@playwright/test';

test('O usuário não deve logar se o código de autenticação for inválido.', async ({
  page,
}) => {
  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };
  await page.goto('http://paybank-mf-auth:3000/');
  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha) {
    await page.getByRole('button', { name: digito }).click();
  }

  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText(
    'Código inválido. Por favor, tente novamente.'
  );
});
