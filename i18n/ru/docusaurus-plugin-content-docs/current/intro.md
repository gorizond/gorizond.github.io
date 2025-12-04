---
sidebar_position: 1
---

# Tutorial Intro

Познакомимся с **Gorizond меньше чем за 5 минут**. Gorizond поднимает k3s API как сервис, работает через Rancher в кластере k8s и создаёт пары инстансов headscale и k3s API серверов.

## Что понадобится

- IoT‑устройство с доступом в интернет (например, Raspberry Pi)

## Использование кластера Gorizond

### Зайдите на [gorizond](https://gorizond.negash.ru) и авторизуйтесь через GitHub

![login](../../../../docs/img/login.png)

### После входа откроется домашняя страница

![homepage](../../../../docs/img/empty-home.png)

### Перейдите в список кластеров [Gorizond](https://gorizond.negash.ru/dashboard/c/_/gorizond/provisioning.gorizond.io.cluster)

![gorizond clusters](../../../../docs/img/empty-gorizond.png)

### Создайте первый [кластер](https://gorizond.negash.ru/dashboard/c/_/gorizond/provisioning.gorizond.io.cluster/create)
Укажите регион workspace и версию k3s

![create cluster](../../../../docs/img/create-cluster.png)

### Дождитесь создания кластера
Обычно это занимает 3–4 минуты

![creating cluster](../../../../docs/img/creating-cluster.png)

### Скопируйте и выполните команду на IoT/сервере

![ready cluster](../../../../docs/img/ready-cluster.png)

:::tip Init Node

Команда ставит tailscale, затем k3s с настройками headscale. Подождите, пока кластер зарегистрируется в Rancher.

:::

### Вернитесь на [gorizond](https://gorizond.negash.ru) и дождитесь готовности кластера

![wait cluster ready](../../../../docs/img/wait-cluster-ready.png)

### Кластер готов к работе с Fleet GitOps

![cluster-ready.png](../../../../docs/img/cluster-ready.png)
