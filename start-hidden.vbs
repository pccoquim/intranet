Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "C:\Intranet\start-intranet.bat" & Chr(34), 0
Set WshShell = Nothing
