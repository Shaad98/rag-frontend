# Access a Local Angular Website from Mobile Over Wi-Fi

## Goal

Run an Angular application on a Linux laptop and access it from a mobile phone connected to the **same Wi-Fi/router**.

Example:

```text
Mobile Phone
     │
     │ Wi-Fi
     ▼
Laptop: 192.168.1.8
     │
     ▼
Angular Dev Server: 4200
```

The mobile can then open:

```text
http://192.168.1.8:4200
```

---

# 1. Find the Laptop's IP Address

## Using `hostname -I`

Run:

```bash
hostname -I
```

Example output:

```text
192.168.1.8 172.18.0.1 172.17.0.1 ...
```

The important address for accessing the laptop from another device on the same Wi-Fi is:

```text
192.168.1.8
```

### Why?

`192.168.1.8` is the laptop's **local/LAN IP address** assigned by the router.

The other addresses may belong to Docker networks or IPv6 networks.

For example:

```text
192.168.1.8   → Laptop's LAN/Wi-Fi IP
172.18.0.1    → Docker network
172.17.0.1    → Docker default bridge
```

For this experiment, we use:

```text
192.168.1.8
```

---

# 2. Find the IP Using `ifconfig`

You can also run:

```bash
ifconfig
```

Look for your Wi-Fi interface.

You may see something like:

```text
wlp2s0:
    inet 192.168.1.8
```

The value after `inet` is the IPv4 address.

However, on modern Linux systems, `ifconfig` may not be installed.

The modern replacement is:

```bash
ip addr
```

Or, if you only want the addresses:

```bash
hostname -I
```

For this use case, `hostname -I` is the simplest.

---

# 3. Start Angular So Other Devices Can Connect

Normally, Angular may bind to localhost.

For example:

```text
localhost:4200
```

`localhost` means the current computer.

A phone cannot normally access the laptop through `localhost`.

Therefore, start Angular with:

```bash
ng serve --host=0.0.0.0
```

or:

```bash
ng s -o --host=0.0.0.0
```

### What does `0.0.0.0` mean?

It tells the development server:

> Listen on all available network interfaces.

This allows the server to accept connections coming through the laptop's LAN/Wi-Fi interface.

---

# 4. Check Angular's Network Address

After starting Angular, you may see:

```text
➜  Local:   http://localhost:4200/
➜  Network: http://192.168.1.8:4200/
```

This is exactly what we want.

The important line is:

```text
Network: http://192.168.1.8:4200/
```

Angular is telling us that other devices on the network can potentially access it using:

```text
http://192.168.1.8:4200
```

---

# 5. Access the Website From Mobile

Make sure:

* Laptop is connected to the Wi-Fi.
* Mobile is connected to the **same Wi-Fi**.
* Angular is still running.

Then open the browser on the mobile and enter:

```text
http://192.168.1.8:4200
```

The mobile should load the Angular application running directly from the laptop.

---

# 6. Check Whether Port 4200 Is Listening

If the mobile cannot connect, check whether something is listening on port `4200`.

Run:

```bash
ss -lntp | grep 4200
```

A good result looks approximately like:

```text
LISTEN 0 511 0.0.0.0:4200 ...
```

The important part is:

```text
0.0.0.0:4200
```

This means the server is listening on all interfaces.

If it only listens on:

```text
127.0.0.1:4200
```

then it is restricted to the laptop itself.

---

# 7. Check the UFW Firewall

Linux may have a firewall called UFW.

Check its status:

```bash
sudo ufw status
```

If you see:

```text
Status: active
```

then UFW is enabled.

The firewall may block incoming connections to port `4200`.

---

# 8. Temporarily Allow Port 4200

To allow incoming TCP connections to Angular's development server:

```bash
sudo ufw allow 4200/tcp
```

Now try again from the mobile:

```text
http://192.168.1.8:4200
```

---

# 9. Check the UFW Rule

Run:

```bash
sudo ufw status numbered
```

You may see:

```text
[ 1] 4200/tcp    ALLOW IN    Anywhere
```

The number depends on your existing firewall rules.

---

# 10. Delete the Port 4200 Rule

Once testing is finished, we don't need to leave the Angular development port open.

The easiest way to remove the exact rule is:

```bash
sudo ufw delete allow 4200/tcp
```

Then verify:

```bash
sudo ufw status
```

---

# 11. Alternative Way to Delete a UFW Rule

You can also delete a rule using its number.

First:

```bash
sudo ufw status numbered
```

Example:

```text
[ 1] 4200/tcp    ALLOW IN    Anywhere
[ 2] 22/tcp       ALLOW IN    Anywhere
```

Then:

```bash
sudo ufw delete 1
```

Replace `1` with the actual rule number of the `4200/tcp` rule.

Be careful with numbered deletion because deleting the wrong rule can remove an important firewall rule.

---

# 12. Complete Command Sequence

Here is the complete workflow we used.

### Find laptop IP

```bash
hostname -I
```

Example:

```text
192.168.1.8 172.18.0.1 172.17.0.1 ...
```

Use:

```text
192.168.1.8
```

### Start Angular

```bash
ng s -o --host=0.0.0.0
```

Angular should show:

```text
Local:   http://localhost:4200/
Network: http://192.168.1.8:4200/
```

### Check the port

```bash
ss -lntp | grep 4200
```

### Check firewall

```bash
sudo ufw status
```

### If necessary, allow Angular

```bash
sudo ufw allow 4200/tcp
```

### Test from mobile

Open:

```text
http://192.168.1.8:4200
```

### After testing, remove the firewall rule

```bash
sudo ufw delete allow 4200/tcp
```

### Verify

```bash
sudo ufw status
```

---

# 13. What We Actually Learned

This small experiment demonstrates several important networking concepts.

## Localhost

```text
localhost
127.0.0.1
```

means:

> This computer itself.

Therefore:

```text
http://localhost:4200
```

on the laptop refers to the laptop.

It does **not** mean the phone can access it.

---

## LAN IP

```text
192.168.1.8
```

is the laptop's address inside the local network.

Therefore:

```text
http://192.168.1.8:4200
```

means:

> Connect to port 4200 on the laptop whose LAN address is 192.168.1.8.

---

## Port

```text
4200
```

identifies the network service.

Angular development server:

```text
192.168.1.8:4200
```

Spring Boot application might be:

```text
192.168.1.8:8080
```

---

## `0.0.0.0`

When we ran:

```bash
ng serve --host=0.0.0.0
```

we told Angular:

> Accept connections through the available network interfaces, not just localhost.

---

## UFW

UFW controls incoming/outgoing network traffic.

We temporarily allowed:

```bash
sudo ufw allow 4200/tcp
```

Then removed it:

```bash
sudo ufw delete allow 4200/tcp
```

This is useful because development servers generally should not be unnecessarily exposed.

---

# 14. Final Architecture

What we built was essentially:

```text
                 Wi-Fi Router
                 /         \
                /           \
               ▼             ▼
        Mobile Phone       Laptop
        192.168.1.x        192.168.1.8
                              │
                              │ TCP :4200
                              ▼
                       Angular Dev Server
                       0.0.0.0:4200
```

The request from the phone is:

```text
Mobile
   │
   │ HTTP
   ▼
192.168.1.8:4200
   │
   ▼
Angular
```

---

# 15. Important Security Note

`ng serve --host=0.0.0.0` is useful for local testing, but it is a **development server**.

Do not treat it as a production deployment.

For production, the Angular application should normally be built:

```bash
ng build
```

and served using an appropriate production web server such as Nginx or another production hosting setup.

Also, don't leave unnecessary UFW ports open.

For our temporary test:

```bash
sudo ufw allow 4200/tcp
```

After testing:

```bash
sudo ufw delete allow 4200/tcp
```

---

# Quick Cheat Sheet

```bash
# Find laptop IP
hostname -I

# Alternative
ifconfig

# Modern alternative
ip addr

# Start Angular for LAN access
ng serve --host=0.0.0.0

# Check Angular port
ss -lntp | grep 4200

# Check firewall
sudo ufw status

# Allow Angular port temporarily
sudo ufw allow 4200/tcp

# Check firewall rules
sudo ufw status numbered

# Remove Angular firewall rule
sudo ufw delete allow 4200/tcp
```

Then from the mobile:

```text
http://<laptop-LAN-IP>:4200
```

For our laptop:

```text
http://192.168.1.8:4200
```
