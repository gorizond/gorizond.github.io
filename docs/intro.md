---
sidebar_position: 1
---

# Tutorial Intro

Let's discover **Gorizond in less than 5 minutes**. Gorizond create k3s api as service. Work with Rancher in k8s cluster. It's generate headscale and k3s api servers peer instance.

## What you'll need

- IoT device with internet access (Raspberry PI for example)

## Gorizond cluster usage

### Go to [gorizond](https://gorizond.negash.ru) and login with github

![login](./img/login.png)

### After login you can see home page

![homepage](img/empty-home.png)

### Go to [Gorizond](https://gorizond.negash.ru/dashboard/c/_/gorizond/provisioning.gorizond.io.cluster) cluster list

![gorizond clusters](img/empty-gorizond.png)

### Create you first [cluster](https://gorizond.negash.ru/dashboard/c/_/gorizond/provisioning.gorizond.io.cluster/create)
With workspace location and k3s version

![create cluster](img/create-cluster.png)

### Wait cluster created
It will take about 3-4 minutes

![creating cluster](img/creating-cluster.png)

### Copy and run command to you IoT/Server

![ready cluster](img/ready-cluster.png)

:::tip Init Node

After running the command on the server or IoT device, the tailscale client will be installed and then k3s with the headscale settings will be installed, you need to wait until the cluster registers in rancher

:::

### Go to [gorizond](https://gorizond.negash.ru) home page and wait cluster ready

![wait cluster ready](img/wait-cluster-ready.png)

### Cluster ready to work with Fleet GitOps

![cluster-ready.png](img/cluster-ready.png)
