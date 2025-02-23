import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

test('O usuário não deve logar se o código de autenticação for inválido.', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };
  await loginPage.acessaPagina();
  await loginPage.informaCPF(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);

  await loginPage.informa2FA('123456');

  await expect(page.locator('span')).toContainText(
    'Código inválido. Por favor, tente novamente.'
  );
});

test('Deve acessar a conta do usuário', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashPage = new DashPage(page);

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };

  await loginPage.acessaPagina();
  await loginPage.informaCPF(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);

  // Garantindo que o código foi processado. checkpoint
  await page
    .getByRole('heading', { name: 'Verificação em duas etapas' })
    .waitFor({ timeout: 3000 });

  const codigo = await obterCodigo2FA(usuario.cpf);

  await loginPage.informa2FA(codigo);

  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00');
});
