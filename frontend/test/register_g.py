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

    google = driver.find_element(value="google")
    driver.implicitly_wait(10)
    google.click()
    driver.implicitly_wait(10)

    child_window = [x for x in driver.window_handles if x != parent_window][0]
    driver.switch_to.window(child_window)
    title = driver.title
    driver.implicitly_wait(10)
    assert title == "Inicia sesión: Cuentas de Google", "No matching title for child window"

    email = driver.find_element(value="identifierId")
    email.send_keys("referenda.es@gmail.com")
    driver.implicitly_wait(10)
    identifier_next = driver.find_element(value="identifierNext")
    identifier_next.click()
    driver.implicitly_wait(10)
    password = driver.find_element(by=By.NAME, value="password")
    driver.implicitly_wait(10)
    password.send_keys("r3f3r3nd4")
    password_next = driver.find_element(value="passwordNext")
    driver.implicitly_wait(10)
    password_next.click()
    driver.implicitly_wait(10)

    driver.switch_to.window(parent_window)
    register_username = driver.find_element(value="complete-username")
    register_username.send_keys("referenda")
    driver.implicitly_wait(10)
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
