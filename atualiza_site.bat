@echo off
echo ===============================
echo Atualizando site Pumbas Burguer
echo ===============================

:: Ir para a pasta do projeto (opcional)
:: cd C:\Users\SeuUsuario\Caminho\Do\Projeto

:: Puxar alterações do remoto
git pull origin main --rebase

:: Adicionar novos arquivos
git add .

:: Criar commit automático com data e hora
set datetime=%date% %time%
git commit -m "Atualização automática: %datetime%"

:: Enviar alterações para o GitHub
git push origin main

echo Site atualizado com sucesso!
pause
