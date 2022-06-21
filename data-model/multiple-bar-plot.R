a_2016 <- c(0.0, .01, 3.8)
a_2017 <- c(0.02, 0.13, 5.37)
a_2018 <- c(0.29, 0.75, 5.3)
a_2019 <- c(0.59, 0.99, 5.16)
a_2020 <- c(2.19, 1.59, 5.46)
a_2021 <- c(2.89, 2.12, 5.56)
test <- cbind(a_2016, a_2017, a_2018, a_2019, a_2019, a_2020, a_2021)


barplot(test,beside=T, legend=TRUE)
legend("topright", legend = c("Interfaces", "Libraries", "Contracts"), pch = 15)


## modifiers
y_2016 <- c(3.02)
y_2017 <- c(3.22)
y_2018 <- c(2.45)
y_2019 <- c(2.05)
y_2020 <- c(1.95)
y_2021 <- c(1.69)
test <- cbind(y_2016, y_2017, y_2018, y_2019, y_2019, y_2020, y_2021)


barplot(test,main="The average number of Modifier",beside=T, legend=TRUE)



### libraries vs -bytecode
y_2016 <- c(0.06, 0.6)
y_2017 <- c(.25, 0.55)
y_2018 <- c(.5, 0.65)
y_2019 <- c(.6, 0.78)
y_2020 <- c(.8, 0.9)
y_2021 <- c(1, 0.7)
test <- cbind(y_2016, y_2017, y_2018, y_2019, y_2019, y_2020, y_2021)


barplot(test, beside=T, legend=TRUE)
legend("topleft", legend = c("Libraries", "Bytecode"), pch = 15)
