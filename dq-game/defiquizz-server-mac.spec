# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

added_files = [
         ( './src/utils', 'utils' ),
         ( './src/utils/fonts', 'utils/fonts' ),
         ( './src/images', 'images' ),
         ( './src/images/icons', 'images/icons' ),
         ( './src/images/tmp', 'images/tmp' ),
         ( './src/info', 'info' ),
         ( './src/game_types', 'game_types' ),
         ( './src/events', 'events' ),
         ( './src/text', 'text' ),
]

a = Analysis(['src/server/main.py'],
            pathex=['.',
              '/Users/sfe1/AppData/Local/Programs/Python/Python36-32/Lib/site-packages',
            ],
            binaries=[],
            datas=added_files,
            hiddenimports=['socket', 'requests', 'pygame', 'fake-rpi' ],
            hookspath=[],
            runtime_hooks=[],
            excludes=['pytest', 'black' ],
            win_no_prefer_redirects=False,
            win_private_assemblies=False,
            cipher=block_cipher,
            noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='defiquizz-server',
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=False,
          debug=False)
coll = COLLECT(exe,
              a.binaries,
              a.zipfiles,
              a.datas,
              strip=False,
              upx=True,
              upx_exclude=[],
              name='defiquizz-server',
              debug=True)
app = BUNDLE(coll,
            name='defiquizz-server.app',
            icon=None,
            bundle_identifier=None,
            console=False,
            debug=False)
