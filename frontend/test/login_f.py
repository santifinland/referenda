# Referenda

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By


def test_login():
    driver = webdriver.Chrome()

    driver.get("https://referenda.es")
    action_chains = ActionChains(driver)

    session = driver.find_element(value="session")
    driver.implicitly_wait(2)
    action_chains.move_to_element(session).perform()

    login_link = driver.find_element(value="login")
    driver.implicitly_wait(2)
    login_link.click()
    driver.implicitly_wait(2)

    title = driver.title
    assert title == "Inicia sesión en Referenda", "No matching title"
    driver.implicitly_wait(2)

    parent_window = driver.window_handles[0]

    facebook = driver.find_element(value="facebook")
    driver.implicitly_wait(10)
    facebook.click()
    driver.implicitly_wait(10)

    child_window = [x for x in driver.window_handles if x != parent_window][0]
    driver.switch_to.window(child_window)
    title = driver.title
    driver.implicitly_wait(10)
    assert title == "Facebook", "No matching title for child window"

    cookies = driver.find_element(by=By.XPATH, value="//button[contains(string(), 'Only allow essential cookies')]")
    cookies.click()
    driver.implicitly_wait(10)

    email = driver.find_element(value="email")
    email.send_keys("jatljptpqh_1655890132@tfbnw.net")
    driver.implicitly_wait(10)
    password = driver.find_element(value="pass")
    password.send_keys("")
    driver.implicitly_wait(10)
    login = driver.find_element(by=By.NAME, value="login")
    login.click()

    driver.switch_to.window(parent_window)
    driver.implicitly_wait(10)
    username = driver.find_element(by=By.LINK_TEXT, value="Samantha Alhbhdehgaegd Adeagboman")
    assert username.text == "Samantha Alhbhdehgaegd Adeagboman", "Not showing the username"

    driver.quit()


if __name__ == "__main__":
    try:
        test_login()
    except Exception as e:
        print('Failed to execute. Exception: {}'.format(e))
