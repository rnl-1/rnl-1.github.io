---
title: speedtest.c
layout: page
---
c code to test computer speed
```cpp
#include <stdio.h>
#include <sys/time.h>

int main() {
    while (1) {
        size_t i = 0;
        struct timeval start, now;
        gettimeofday(&start, NULL);

        do {
            if (!(i & 0xFFFFFF)) {
                gettimeofday(&now, NULL);
            }
            i++;
        } while (now.tv_sec-start.tv_sec < 1 || (now.tv_sec-start.tv_sec == 1 && now.tv_sec < start.tv_sec));

        printf("%.2f M ops/s\n", i/1e6);
    }
}
```
