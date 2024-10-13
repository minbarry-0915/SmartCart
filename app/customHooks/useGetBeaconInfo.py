# deceperated
# import asyncio
# from bleak import BleakScanner
# import matplotlib.pyplot as plt
# plt.rcParams['font.family'] = 'Malgun Gothic'

# # 비콘 위치 (층, 칸) 및 RSSI 초기화
# beacons = {
#     "C3:00:00:1C:62:47": {"floor": 1, "row": 1, "col": 1, "rssi": None},  # 비콘 1
#     "C3:00:00:1C:62:48": {"floor": 1, "row": 2, "col": 4, "rssi": None},  # 비콘 2
#     "C3:00:00:1C:62:51": {"floor": 1, "row": 5, "col": 5, "rssi": None},  # 비콘 3
#     "C3:00:00:1C:62:55": {"floor": 2, "row": 3, "col": 3, "rssi": None},  # 비콘 4
#     "C3:00:00:1C:62:45": {"floor": 2, "row": 1, "col": 1, "rssi": None},  # 사용자의 위치 비콘
# }

# # 물건 목록과 물건 위치를 비콘과 매핑
# item_locations = {
#     "책": "C3:00:00:1C:62:47",    # 책은 비콘 1 근처에 위치
#     "노트북": "C3:00:00:1C:62:48",  # 노트북은 비콘 2 근처에 위치
#     "핸드폰": "C3:00:00:1C:62:51",  # 핸드폰은 비콘 3 근처에 위치
#     "태블릿": "C3:00:00:1C:62:55"  # 태블릿은 비콘 4 근처에 위치
# }

# # 물건의 위치 검색 함수
# def search_item(item_name):
#     if item_name in item_locations:
#         beacon_address = item_locations[item_name]
#         return beacons[beacon_address]
#     else:
#         return None

# # 물건의 위치 안내 함수
# def guide_user_to_item(item_position):
#     if item_position is not None:
#         return f"{item_position['floor']}층 {item_position['row']}번째 줄, {item_position['col']}번째 칸에 있습니다."
#     else:
#         return "해당 물건을 찾을 수 없습니다."

# # 시각적으로 위치 표시 함수
# def plot_positions(item_position):
#     fig, ax = plt.subplots()

#     # 물건의 위치를 빨간색 점으로 표시
#     ax.scatter(item_position['col'], item_position['row'], color='red', label='Item Position')

#     # 축 설정
#     ax.set_xlim(0, 5)
#     ax.set_ylim(0, 5)
#     ax.invert_yaxis()
#     ax.set_xticks(range(1, 6))
#     ax.set_yticks(range(1, 6))
#     ax.set_xlabel('칸')
#     ax.set_ylabel('줄')

#     # 제목과 범례 추가
#     ax.set_title(f"{item_position['floor']}층 지도")
#     ax.legend()

#     plt.show()

# # 비콘 신호 스캔 함수 (추가적인 비콘 신호 스캔은 필요에 따라 사용)
# async def scan_beacons():
#     def detection_callback(device, advertisement_data):
#         if device.address in beacons:
#             beacons[device.address]["rssi"] = advertisement_data.rssi
#             #print(f"Updated {device.address} with RSSI {advertisement_data.rssi}")

#     scanner = BleakScanner(detection_callback)
#     await scanner.start()
#     await asyncio.sleep(10)  # 스캔 시간을 설정
#     await scanner.stop()

# # 검색 및 위치 안내 실행 함수
# async def search_and_guide_item(item_name):
#     # 비콘을 스캔하여 RSSI 값을 업데이트 (필요시 사용)
#     await scan_beacons()

#     # 물건 검색
#     item_position = search_item(item_name)
#     if item_position:
#         # 위치 안내
#         direction = guide_user_to_item(item_position)
#         print(direction)

#         # 시각적으로 위치 표시
#         plot_positions(item_position)
#     else:
#         print("해당 물건을 찾을 수 없습니다.")

# # 사용자가 물건을 검색할 수 있도록 입력
# item_to_search = input("검색할 물건을 입력하세요: ")
# asyncio.run(search_and_guide_item(item_to_search))
