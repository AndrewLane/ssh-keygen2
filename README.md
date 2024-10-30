@andrewwlane/ssh-keygen2
========================

Automate ssh-keygen command for generating RSA keypairs

### Note

Forked from [this package](https://www.npmjs.com/package/ssh-keygen2) which has been abandoned.

### Contributions

All contributions welcome, especially for [Hacktoberfest](https://hacktoberfest.com/).

### Rationale

This module is useful if you want:

- encrypted PEM format ([keypair](https://www.npmjs.org/package/keypair)
  and [rsa-json](https://www.npmjs.org/package/rsa-json) do not support this)
- ssh-format, single-line pubkey (again not supported by the above modules)
- fingerprint (supported by [ssh-keygen](https://www.npmjs.org/package/ssh-keygen)
  but requires a second function call)
- error handling (errors are not handled by [ssh-keygen](https://www.npmjs.org/package/ssh-keygen))
- option to keep the resulting key files, or clean them up
  ([ssh-keygen](https://www.npmjs.org/package/ssh-keygen)'s `destroy` option does nothing)
- randomart.

### Requirements

This is just a wrapper around `ssh-keygen`, so it requires that
command to be installed and in the path.

### Usage

```js
import keygen from "@andrewwlane/ssh-keygen2";
import assert from "assert";

// generate a temporary keypair and return details
keygen(function (err, keypair) {
  assert.ifError(err);
  console.log(keypair.private);
  console.log(keypair.public);
  console.log(keypair.fingerprint + "\n");
  console.log(keypair.randomart + "\n");
});
```

This outputs:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y79xltKAFobrBe/uIyDoZJGsd946jsiFBNXUp5Lp9JPbP/+
2K/E09exEOXdVIaZTLM/jS3rYV+tx/7KS8c6DItl3xksm/RWIUdrfq+quq2py4k2
K3AIMarZj9RZaANCWlgDvAGFhWe9bElNdJyuJLB+cLc2/e6J6BotxgpvmXCya4le
hdFTd9frB37Fk+wThaFGZ9eaCiXDnDnGkNOxkJdo+wG1HXadFXN9T2sPTX4/RJpd
EsS57a/fMUd/t9a/ieBfn23whv6lsPUoh5bYlnamIpRVna2t4lya5AxHSfzuXH28
R8lLP3NI4X0U7IzVchqOTj9MmubCAo2zOKVpqwIDAQABAoIBAQCkk0TwW89hOWMU
I06ZVBkoceV9WgDvC2O3Gn1w0AqgkQV5mA6ABIJy0KkpmSzabh7E4t0dNhvuTCMB
tzMOkjcflPZ7YJztGdXuqtVcF//gPfTkeS0GriRxRTk5wM46ZpzcsNS1+QfwfkmA
Wo0u8MG+5LFYOjtA7+50TuL17ko42KGh299HBUA8H4Svje1rOyp/Oot4g1Ujz1h4
1D5a3VZQWaD69FhAVNbLZWHPZxwopKGe9oBNmnq3/Yd/3ZOjOyksMOqllwTDtvAZ
Ve9ZudIOR6s3jRz4stbMAAJuxp8ZsSPrFgMDjnHnZXgAmp9+1QPJUL2SwCVmyQ97
V1e3musxAoGBAPRtdwlLnyxCdEMdEZMGkM3Y7yMwoFnwPrXgTR1g8CsgShf5pm1g
UwjpCFJbathTmzcP6YpPy7yx+rBJrYwaZbvlBqiaG9+6cEMx2tidg+Qr1aw9ykiH
0M5RFScSaxvl/IU+v7fl8Sw1gI2Cw08U66f5ARmh1G9WUvgBaCWQ+aj5AoGBANt6
5zqMTALSpjeYcbgGbrdj4hja1k+6dikN/qP4DHbTx5ekKiCgPYglQWBWtm36dwDY
tVfcnnQIH14t6V3q3uPTCY8yjfleVPAAbZsqakbtcWI6vG4YvlxzwVR1rrBnvFwu
2QUOSnkgV/kXI38yOd9OnCtn7wOmzIeWH/ZhSFTDAoGAdWO5PrKd8JC965mjXhxS
ITqlpx3sdSVnyMu/3XM4BU5Np3QT1QXk+yuH/p2/E8QbkHdI709hhu9neZD5E4d+
Ap588y6IYovU7MCd3VjRBh1zUnSemPT5eI0CfrBe1pg/DfNT+ksp59SON+hsSqe+
gf6Z46iQMSShVlC+pwQYk2kCgYBRqgRZa5RoxHpmW0mM4I/Xmsmo19xAJDANDJD/
766rlBdC3Cl0pErg2oPd1cXhW/1lijzHaWZn5BHP2CNp95dhi8eVyYi8DZZrCq29
u2V56KV0mEg+auSBv+xigbszFhYm8qN7VxrswNUa8LobfNO9vCEtoWl0oV6e4IQa
B46DQwKBgEJxjCbbnmqF9sONBsNb96a+grwB0GuNgHueessnfXuRrT+WP2+vuUk2
N0khNzMFGO4KMjhg2q+dlwofB+DajIz+/ggYHUgC7u8JJsa6YGfvbi+Yi8XKlAB6
Tjal5LVfcGX6OK/TiGR8h9a8zE3paQtzix8iviV0Xnle3P2w+k18
-----END RSA PRIVATE KEY-----

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDRjv3GW0oAWhusF7+4jIOhkkax33jqOyIUE1dSnkun0k9s//7Yr8TT17EQ5d1UhplMsz+NLethX63H/spLxzoMi2XfGSyb9FYhR2t+r6q6ranLiTYrcAgxqtmP1FloA0JaWAO8AYWFZ71sSU10nK4ksH5wtzb97onoGi3GCm+ZcLJriV6F0VN31+sHfsWT7BOFoUZn15oKJcOcOcaQ07GQl2j7AbUddp0Vc31Paw9Nfj9Eml0SxLntr98xR3+31r+J4F+fbfCG/qWw9SiHltiWdqYilFWdra3iXJrkDEdJ/O5cfbxHyUs/c0jhfRTsjNVyGo5OP0ya5sICjbM4pWmr 

1c:88:5c:dd:3f:67:43:ed:7b:36:5f:44:06:97:63:07

+--[ RSA 2048]----+
|      .. .    E+o|
|   . o .. .   .==|
|    o . .  . ..+o|
|       . .  o + o|
|        S    + o.|
|               o+|
|               .=|
|                .|
|                 |
+-----------------+
```

With full options:

```js
import keygen from "@andrewwlane/ssh-keygen2";
import assert from "assert";

var opts = {
  type: "rsa",
  bits: 4096,
  passphrase: "this will encrypt the private key",
  location: "/path/to/id_rsa",
  keep: true, // this will keep the resulting files
  comment: "optional comment for ssh public key",
};

keygen(opts, function (err, keypair) {
  assert.ifError(err);
  console.log(keypair.private);
  console.log(keypair.public);
  console.log(keypair.fingerprint + "\n");
  console.log(keypair.randomart + "\n");
});
```

This outputs:

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,B134A7BE67B71FBA48E71135C89C7622

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
-----END RSA PRIVATE KEY-----

ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCj3NtknpOBMjQbrphpHQH9jIi5VOHsqg3XqZAdZTK2ohfdaKoBTs0uE4hpnhO+5B0Otsxsj6+VNwuzamtJwiVgXl0NJyo1LYpdxvxNx5WsZpfBmBIbafOVV4JkBTnSxnb5slv1jab2qGteqyGIOKWQkQ7J69slCtMC4VPJY5TTSEwizxUE2X+J87TC1N+kPlsboMpE6LpI4E+h595AMFx7OEO3aH0JgWHrPqNhIjsVtvi38puPGcWe4DrjmQZ8d9NOcjiL/62fkwngozqwETuFE8eJhn8J2pfScdl4faAtw1WYqaWNN27YwV6RvsfVmxE5Y0qiA7vwJL2CewOOgpyWryH/i2dhpdBTO9Rbcd+jfaVeJ2bd4Jmuj5rybSb7Gcy6YaPijsSZyioVnxgroO4xiklrD2rjCiqA4+0+9v4f7WZ3m2IpJFYKK3mgRgNnScnn8VMyT782UXPnd/To2dDNcvTHmKyTPoELve8utC4gjOcYXT1+SFOyPs9NvyNpbXECUaMj9hLX7WEcxGCjJL7UCiNv/yJwlHyunZR0mY7f18sYVWvCk3RfBtjLrMDmhHliFy8t/uKGq9J5R0JoJhDRkfHy7BdLKlBkVXezNnd7sDSjoIYB0aLRxCYo2D+tGBkav/L+AeWRnXE9U5fgL+iDSBcgAwBtGZvzskpgyav5ZQ== optional comment for ssh public key

ed:8c:0e:31:14:e7:f6:58:6b:51:10:9c:66:44:4d:5c optional comment for ssh public key

+--[ RSA 4096]----+
|      . .+=Bo.E  |
|       +  =.o    |
|      . ooo      |
|     . . = o     |
|      o S =      |
|       o =       |
|      . . o      |
|       o         |
|        .        |
+-----------------+
```

- - -

### License: MIT

- Copyright (C) 2014 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2014 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
