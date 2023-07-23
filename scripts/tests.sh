# test cases
npx bddgen " " && npx playwright test
npx bddgen "@pw and @2002 and not  @2002.1" && npx playwright test
npx bddgen "@pw and @2002 and @focus" && npx playwright test
npx bddgen "@emergency and @4003" && npx playwright test
npx bddgen "@emergency and not @4003" && npx playwright test
# leave all tests built
npx bddgen && npx playwright test
