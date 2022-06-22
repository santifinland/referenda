# Referenda

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By


def test_register():
    driver = webdriver.Chrome()

    driver.get("https://referenda.es")
    action_chains = ActionChains(driver)

    session = driver.find_element(value="session")
    driver.implicitly_wait(2)
    action_chains.move_to_element(session).perform()

    register_link = driver.find_element(value="register")
    driver.implicitly_wait(2)
    register_link.click()
    driver.implicitly_wait(2)

    title = driver.title
    assert title == "Regístrate en Referenda y empieza a votar", "No matching title"
    driver.implicitly_wait(2)

    parent_window = driver.window_handles[0]

    google = driver.find_element(value="facebook")
    driver.implicitly_wait(10)
    google.click()
    driver.implicitly_wait(10)

    child_window = [x for x in driver.window_handles if x != parent_window][0]
    driver.switch_to.window(child_window)
    title = driver.title
    print(title)
    driver.implicitly_wait(100)
    assert title == "Facebook", "No matching title for child window"

    cookies = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Only allow essential cookies')]")
    cookies.click()
    driver.implicitly_wait(100)

    #email = driver.find_element(value="email")
    #email.send_keys("referenda.es@gmail.com")
    #driver.implicitly_wait(100)
    #password = driver.find_element(value="pass")
    #driver.implicitly_wait(100)
    #password.send_keys("r3f3r3nd4")
    create_account = driver.find_element(by=By.LINK_TEXT, value="Create new account")
    driver.implicitly_wait(100)
    create_account.click()
    driver.implicitly_wait(100)

    driver.switch_to.window(parent_window)
    cookies_reg = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Only allow essential cookies')]")
    driver.implicitly_wait(100)
    cookies_reg.click()

    firstname = driver.find_element(by=By.NAME, value="firstname")
    firstname.send_keys("referenda")
    lastname = driver.find_element(by=By.NAME, value="lastname")
    lastname.send_keys("es")

    register_username = driver.find_element(value="complete-username")
    register_username.send_keys("referenda")
    driver.implicitly_wait(100)
    gdpr = driver.find_element(value="complete-gdpr")
    gdpr.click()
    driver.implicitly_wait(100)
    register_button = driver.find_element(value="complete-register")
    driver.implicitly_wait(100)
    register_button.click()
    driver.implicitly_wait(100)

    username = driver.find_element(value="username")
    driver.implicitly_wait(100)
    driver.implicitly_wait(100)
    assert username.text == "referenda", "Not showing the username"

    driver.quit()


if __name__ == "__main__":
    try:
        test_register()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
