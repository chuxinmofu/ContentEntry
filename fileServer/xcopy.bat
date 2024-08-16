@echo off

:: 指定源文件夹路径
set "source_folder=D:\xnr\fileServer\locales"

:: 指定父目标文件夹路径
set "parent_target_folder=D:\erumeta\webapp"

:: 列出所有目标子文件夹路径（根据实际情况替换或添加）
set "target_subfolders=erumeta-activites,erumeta-admissions,erumeta-affairs,erumeta-assement,erumeta-enrollment,erumeta-open,erumeta-payment,erumeta-portal,erumeta-scrm,erumeta-tenant,erumeta-studentExam"

:: 遍历目标子文件夹并进行复制
::     xcopy /E /I %source_folder% %target_folder%
for %%s in (%target_subfolders%) do (
    echo Copying contents of "%source_folder%" to D:\erumeta\webapp\%%s...
	xcopy /E /I /Y %source_folder% D:\erumeta\webapp\%%s\src\locales
)

echo All copying tasks completed.
pause